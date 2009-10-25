class PrizeCategory < ActiveRecord::Base
  has_many :giveaways
end
