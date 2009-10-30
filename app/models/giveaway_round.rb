class GiveawayRound < ActiveRecord::Base
  has_many :giveaways, :order => 'position'
  
  validates_uniqueness_of :time
  
  def name_for_admin_assistant
    pretty_time
  end
  
  def pretty_time
    time.strftime "%a %b %d %Y %I:%M %p"
  end
end
