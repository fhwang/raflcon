class ApplicationSetting < ActiveRecord::Base
  validates_uniqueness_of :name
  validates_inclusion_of :name,
                         :in => %w(username password max_giveaway_attempt_size)
  
  serialize :value
  
  def self.value(name)
    if as = find_by_name(name)
      as.value
    end
  end
end
