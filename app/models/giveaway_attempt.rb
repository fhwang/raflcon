class GiveawayAttempt < ActiveRecord::Base
  has_many   :attendees
  belongs_to :giveaway
end
