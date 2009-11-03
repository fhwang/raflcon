class Configuration < ActiveRecord::BaseWithoutTable
  ASBackedColumns = {
    :username => :string, :password => :string, :time_zone => :time_zone,
    :max_giveaway_attempt_size => :integer
  }
  
  column :start_date, :date
  column :end_date, :date
  ASBackedColumns.each do |name, column_type|
    column name, column_type
  end
  
  validates_presence_of :start_date, :end_date
  validates_presence_of *ASBackedColumns.keys
  validates_confirmation_of :password
  
  def self.first
    atts = {}
    ASBackedColumns.each do |name, column_type|
      as = ApplicationSetting.find_by_name name.to_s
      atts[name] = as.value if as
    end
    if conference = Conference.first
      atts[:start_date] = conference.start_date
      atts[:end_date] = conference.end_date
    end
    new atts
  end
  
  def create_or_update
    if super
      ASBackedColumns.each do |name, column_type|
        name = name.to_s
        as = ApplicationSetting.find_by_name name
        as ||= ApplicationSetting.new :name => name
        as.value = self.send name
        as.value = as.value.to_i if column_type == :integer
        as.value_class = 'TZInfo::Timezone' if column_type == :time_zone
        as.save!
      end
      conference = Conference.first || Conference.new
      conference.update_attributes(
        :start_date => start_date, :end_date => end_date
      )
    end
  end
end
