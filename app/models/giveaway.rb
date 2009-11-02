class Giveaway < ActiveRecord::Base
  has_many     :giveaway_attempts
  belongs_to   :giveaway_round
  acts_as_list :scope => :giveaway_round
  belongs_to   :prize_category
  
  validates_presence_of   :count
  validates_presence_of   :giveaway_round_id
  validates_presence_of   :position
  validates_presence_of   :position, :scope => :giveaway_round_id
  validates_presence_of   :prize_category_id
  validates_uniqueness_of :prize_category_id, :scope => :giveaway_round_id
  
  def suggested_attempt_size
    setting = ApplicationSetting.value('max_giveaway_attempt_size').to_i
    count < setting ? count : setting
  end
  
  def validate
    conditions = ["prize_category_id = ?", self.prize_category_id]
    if self.id
      conditions.first << " and id <> ?"
      conditions << self.id
    end
    other_giveaways = Giveaway.find(:all, :conditions => conditions)
    new_total = other_giveaways.inject(0) { |sum, giveaway|
      sum + giveaway.count
    }
    if new_total + self.count > prize_category.count
      errors.add(
        :count,
        "can't be more than #{prize_category.count - new_total} due to other giveaways for the \"#{prize_category.name}\" prize category"
      )
    end
  end
end
