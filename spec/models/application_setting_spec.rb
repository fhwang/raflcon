require 'spec_helper'

describe 'ApplicationSetting#value_class TZInfo::Timezone' do
  before :all do
    ApplicationSetting.destroy_all
    @as = ApplicationSetting.new(
      :name => 'time_zone', :value => TZInfo::Timezone.get('America/New_York'),
      :value_class => 'TZInfo::Timezone'
    )
    @as.save!
  end
  
  it 'should leave the value the same on the instance' do
    @as.value.identifier.should == 'America/New_York'
  end
  
  it 'should save as the identifier' do
    ApplicationSetting.count(
      :conditions => {:value => 'America/New_York'}
    ).should == 1
  end
  
  it 'should retrieve from the DB as the TZInfo::Timezone instance' do
    as_prime = ApplicationSetting.find @as.id
    as_prime.value.identifier.should == 'America/New_York'
  end
end

describe 'ApplicationSetting name' do
  before :all do
    ApplicationSetting.destroy_all
    ApplicationSetting.create! :name => 'username', :value => 'bill'
  end
  
  it 'should be uniquness' do
    app_setting = ApplicationSetting.new :name => 'username', :value => 'bob'
    app_setting.should_not be_valid
  end
end
