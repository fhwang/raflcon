class Configuration < ActiveRecord::BaseWithoutTable
  column :username, :string
  column :password, :string
  column :start_date, :date
  column :end_date, :date
  
  validates_presence_of :username, :password, :start_date, :end_date
  validates_confirmation_of :password
  
  def self.first
    atts = {}
    %w(username password).each do |as_field|
      as = ApplicationSetting.find_by_name as_field
      atts[as_field] = as.value if as
    end
    if conference = Conference.first
      atts[:start_date] = conference.start_date
      atts[:end_date] = conference.end_date
    end
    if atts.size == 4
      new atts
    end
  end
  
  def create_or_update
    if super
      %w(username password).each do |as_field|
        as = ApplicationSetting.find_by_name as_field
        as ||= ApplicationSetting.new :name => as_field
        as.value = self.send as_field
        as.save!
      end
      conference = Conference.first || Conference.new
      conference.update_attributes(
        :start_date => start_date, :end_date => end_date
      )
    end
  end
end
