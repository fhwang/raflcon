class ApplicationSetting < ActiveRecord::Base
  validates_uniqueness_of :name
  validates_inclusion_of :name,
                         :in => Configuration::ASBackedColumns.keys.map(&:to_s)
  
  serialize :value
  
  def self.value(name)
    if as = find_by_name(name)
      as.value
    end
  end
  
  def after_find
    if attributes['value_class'] && value_class == 'TZInfo::Timezone'
      begin
        self.value = TZInfo::Timezone.get self.value
      rescue TZInfo::InvalidTimezoneIdentifier
        self.value = nil
      end
    end
  end
  
  def after_save
    if value_class == 'TZInfo::Timezone'
      self.value = @orig_value
    end
  end
  
  def before_save
    if value_class == 'TZInfo::Timezone'
      @orig_value = self.value
      self.value = self.value.identifier
    end
  end
end
