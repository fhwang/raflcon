class ApplicationSetting < ActiveRecord::Base
  validates_inclusion_of :name, :in => %w(username password)
  
  serialize :value
  
  def self.value(name)
    if as = find_by_name(name)
      as.value
    end
  end
end
