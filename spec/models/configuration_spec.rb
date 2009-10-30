require 'spec_helper'

describe 'Configuration creation' do
  before :all do
    ApplicationSetting.destroy_all
    Conference.destroy_all
  end
  
  before :each do
    Configuration.create!(
      :username => 'bill', :password => 'bob',
      :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1)
    )
  end
  
  it 'should save two ApplicationSettings' do
    ApplicationSetting.count.should == 2
    ApplicationSetting.value('username').should == 'bill'
    ApplicationSetting.value('password').should == 'bob'
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
      :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1)
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
  end
end

describe 'Configuration updating' do
  before :all do
    ApplicationSetting.destroy_all
    ApplicationSetting.create! :name => 'username', :value => 'bill'
    ApplicationSetting.create! :name => 'password', :value => 'bob'
    Conference.destroy_all
    Conference.create!(
      :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1)
    )
  end
  
  before :each do
    configuration = Configuration.first
    configuration.update_attributes(
      :username => 'billbill', :password => 'bobbob',
      :start_date => Date.new(2010,5,30), :end_date => Date.new(2010,6,1)
    )
  end
  
  it 'should update the existing ApplicationSettings' do
    ApplicationSetting.count.should == 2
    ApplicationSetting.value('username').should == 'billbill'
    ApplicationSetting.value('password').should == 'bobbob'
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
    Conference.destroy_all
    Conference.create!(
      :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1)
    )
  end
  
  before :each do
    configuration = Configuration.first
    configuration.update_attributes(
      :username => nil, :password => 'bobbob',
      :start_date => Date.new(2010,5,30), :end_date => Date.new(2010,6,1)
    )
  end

  it 'should not update the existing ApplicationSettings' do
    ApplicationSetting.count.should == 2
    ApplicationSetting.value('username').should == 'bill'
    ApplicationSetting.value('password').should == 'bob'
  end
  
  it 'should not update the Conference' do
    Conference.count.should == 1
    Conference.first.start_date.should == Date.new(2009,5,30)
    Conference.first.end_date.should == Date.new(2009,6,1)
  end
end

