class GiveawayRound < ActiveRecord::Base
  has_many :giveaways, :order => 'position'
  
  validates_uniqueness_of :time
  
  def after_save
    date_time = DateTime.new(
      time.year, time.month, time.day, time.hour, time.min
    )
    time_zone = ApplicationSetting.value 'time_zone'
    self.time = time_zone.period_for_utc(date_time).to_local(date_time)
  end
  
  def name_for_admin_assistant
    pretty_time
  end
  
  def pretty_time
    time.strftime "%a %b %d %I:%M %p"
  end
end
