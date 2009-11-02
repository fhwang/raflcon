class GiveawayAttempt < ActiveRecord::Base
  has_many :attendees
  
  def size
    attendees.size
  end
end
