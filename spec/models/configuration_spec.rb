require 'spec_helper'

describe 'Configuration creation' do
  before :all do
    ApplicationSetting.destroy_all
    Conference.destroy_all
  end
  
  before :each do
    Configuration.create!(
      :username => 'bill', :password => 'bob',
      :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1),
      :max_giveaway_attempt_size => 10,
      :time_zone => TZInfo::Timezone.get('America/New_York')
    )
  end
  
  it 'should save four ApplicationSettings' do
    ApplicationSetting.count.should == 4
    ApplicationSetting.value('username').should == 'bill'
    ApplicationSetting.value('password').should == 'bob'
    ApplicationSetting.value('max_giveaway_attempt_size').should == '10'
    ApplicationSetting.value('time_zone').identifier.should ==
        'America/New_York'
  end
  
  it 'should save one Conference' do
    Conference.count.should == 1
    Conference.first.start_date.should == Date.new(2009,5,30)
    Conference.first.end_date.should == Date.new(2009,6,1)
  end
end

describe 'Configuration creation when the username is missing' do
  before :all do
    ApplicationSetting.destroy_all
    Conference.destroy_all
  end
  
  before :each do
    Configuration.create(
      :username => nil, :password => 'bob',
      :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1),
      :max_giveaway_attempt_size => 10, :time_zone => 'America - New York'
    )
  end

  it 'should not save any ApplicationSettings' do
    ApplicationSetting.count.should == 0
  end
  
  it 'should not save the Conference' do
    Conference.count.should == 0
  end
end

describe 'Configuration find' do
  before :all do
    ApplicationSetting.destroy_all
    ApplicationSetting.create! :name => 'username', :value => 'bill'
    ApplicationSetting.create! :name => 'password', :value => 'bob'
    ApplicationSetting.create!(
      :name => 'max_giveaway_attempt_size', :value => 10
    )
    ApplicationSetting.create!(
      :name => 'time_zone',
      :value => TZInfo::Timezone.get('America/New_York'),
      :value_class => 'TZInfo::Timezone'
    )
    Conference.destroy_all
    Conference.create!(
      :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1)
    )
  end
  
  it 'should find an instance with pre-filled values' do
    configuration = Configuration.first
    configuration.should have_attributes(
      :username => 'bill', :password => 'bob',
      :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1)
    )
    configuration.time_zone.identifier.should == 'America/New_York'
  end
end

describe 'Configuration updating' do
  before :all do
    ApplicationSetting.destroy_all
    ApplicationSetting.create! :name => 'username', :value => 'bill'
    ApplicationSetting.create! :name => 'password', :value => 'bob'
    ApplicationSetting.create!(
      :name => 'max_giveaway_attempt_size', :value => 10
    )
    ApplicationSetting.create!(
      :name => 'time_zone', :value => 'America - New York'
    )
    Conference.destroy_all
    Conference.create!(
      :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1)
    )
  end
  
  before :each do
    configuration = Configuration.first
    configuration.update_attributes(
      :username => 'billbill', :password => 'bobbob',
      :start_date => Date.new(2010,5,30), :end_date => Date.new(2010,6,1),
      :max_giveaway_attempt_size => 12,
      :time_zone => TZInfo::Timezone.get('America/Denver')
    )
  end
  
  it 'should update the existing ApplicationSettings' do
    ApplicationSetting.count.should == 4
    ApplicationSetting.value('username').should == 'billbill'
    ApplicationSetting.value('password').should == 'bobbob'
    ApplicationSetting.value('max_giveaway_attempt_size').should == '12'
    ApplicationSetting.value('time_zone').identifier.should ==
        'America/Denver'
  end
  
  it 'should update the Conference' do
    conference = Conference.first
    conference.start_date.should == Date.new(2010,5,30)
    conference.end_date.should == Date.new(2010,6,1)
  end
end

describe 'Configuration updating when the username is missing' do
  before :all do
    ApplicationSetting.destroy_all
    ApplicationSetting.create! :name => 'username', :value => 'bill'
    ApplicationSetting.create! :name => 'password', :value => 'bob'
    ApplicationSetting.create!(
      :name => 'max_giveaway_attempt_size', :value => 10
    )
    Conference.destroy_all
    Conference.create!(
      :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1)
    )
  end
  
  before :each do
    configuration = Configuration.first
    configuration.update_attributes(
      :username => nil, :password => 'bobbob',
      :start_date => Date.new(2010,5,30), :end_date => Date.new(2010,6,1),
      :max_giveaway_attempt_size => 12
    )
  end

  it 'should not update the existing ApplicationSettings' do
    ApplicationSetting.count.should == 3
    ApplicationSetting.value('username').should == 'bill'
    ApplicationSetting.value('password').should == 'bob'
    ApplicationSetting.value('max_giveaway_attempt_size').should == '10'
  end
  
  it 'should not update the Conference' do
    Conference.count.should == 1
    Conference.first.start_date.should == Date.new(2009,5,30)
    Conference.first.end_date.should == Date.new(2009,6,1)
  end
end

