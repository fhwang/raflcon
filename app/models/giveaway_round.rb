class GiveawayRound < ActiveRecord::Base
  has_many :giveaways, :order => 'position'
  
  def name_for_admin_assistant
    self.time.strftime("%a %b %d %I:%M %p")
  end
end
