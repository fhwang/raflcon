require 'spec_helper'

describe 'ApplicationSetting#value_class TZInfo::Timezone' do
  before :all do
    ApplicationSetting.delete_all
    ApplicationSetting['time_zone'] = TZInfo::Timezone.get('America/New_York')
  end
  
  it 'should save as the identifier' do
    ApplicationSetting.count(
      :conditions => {:value => 'America/New_York'}
    ).should == 1
  end
  
  it 'should retrieve from the DB as the TZInfo::Timezone instance' do
    ApplicationSetting['time_zone'].identifier.should == 'America/New_York'
  end
end

describe 'ApplicationSetting key' do
  before :all do
    ApplicationSetting.delete_all
    ApplicationSetting['username'] = 'bill'
  end
  
  it 'should be uniquness' do
    app_setting = ApplicationSetting.new :key => 'username', :value => 'bob'
    app_setting.should_not be_valid
  end
end
