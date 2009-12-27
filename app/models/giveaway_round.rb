class GiveawayRound < ActiveRecord::Base
  has_many :giveaways, :order => 'position'
  
  validates_presence_of :time
  validates_uniqueness_of :time
  
  def self.update_active_giveaways
    connection.execute "update giveaway_rounds set active_giveaways = (select count(*) from giveaways where giveaways.giveaway_round_id = giveaway_rounds.id and giveaways.active = 't')"
  end
  
  def after_save
    date_time = DateTime.new(
      time.year, time.month, time.day, time.hour, time.min
    )
    time_zone = ApplicationSetting['time_zone']
    self.time = time_zone.period_for_utc(date_time).to_local(date_time)
  end
  
  def name_for_admin_assistant
    pretty_time
  end
  
  def pretty_time
    tz = ApplicationSetting['time_zone']
    tz.utc_to_local(time).strftime("%a %b %d %I:%M %p")
  end
end
