class Attendee < ActiveRecord::Base
  belongs_to :giveaway_attempt
  
  validates_presence_of :name
  validates_uniqueness_of :name
end
