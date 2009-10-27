class PrizeCategory < ActiveRecord::Base
  has_many :giveaways
  
  validates_uniqueness_of :name
end
