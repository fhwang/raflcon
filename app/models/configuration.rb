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
  validates_presence_of *(ASBackedColumns.keys-[:password])
  validates_presence_of :password, :if => :new?
  validates_confirmation_of :password
  
  def self.first
    atts = {}
    ASBackedColumns.each do |name, column_type|
      atts[name] = ApplicationSetting[name]
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
        unless name == :password && self.password.blank?
          ApplicationSetting[name] = self.send name
        end
      end
      conference = Conference.first || Conference.new
      conference.update_attributes(
        :start_date => start_date, :end_date => end_date
      )
    end
  end
  
  def new?
    ApplicationSetting.count == 0 and Conference.count == 0
  end
end
