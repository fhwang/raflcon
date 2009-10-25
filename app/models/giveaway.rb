class Giveaway < ActiveRecord::Base
  belongs_to   :giveaway_round
  acts_as_list :scope => :giveaway_round
  belongs_to   :prize_category
  
  validates_presence_of   :count
  validates_presence_of   :giveaway_round_id
  validates_presence_of   :position
  validates_presence_of   :position, :scope => :giveaway_round_id
  validates_presence_of   :prize_category_id
  validates_uniqueness_of :prize_category_id, :scope => :giveaway_round_id
end
