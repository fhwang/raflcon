require 'tzinfo'

class ApplicationSetting < ActiveRecord::Base
  acts_as_durable_hash do |dh|
    dh.serialize(TZInfo::Timezone) do |value|
      value.identifier
    end
    dh.deserialize(TZInfo::Timezone) do |data|
      TZInfo::Timezone.get data
    end
  end
end
