require 'spec_helper'

describe Configuration do
  describe 'Creation when the password is missing' do
    before :all do
      ApplicationSetting.destroy_all
      Conference.destroy_all
    end

    before :each do
      @configuration = Configuration.new(
        :username => 'bill', :password => '', :password_confirmation => '',
        :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1),
        :max_giveaway_attempt_size => 10, :time_zone => 'America - New York'
      )
    end

    it 'should not be valid' do
      @configuration.should_not be_valid
      @configuration.errors[:password].should == ["can't be blank"]
    end
  end

  describe 'When the password_confirmation is missing' do
    before :all do
      ApplicationSetting.destroy_all
      Conference.destroy_all
    end

    before :each do
      @configuration = Configuration.new(
        :username => 'bill', :password => 'bill', :password_confirmation => '',
        :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1),
        :max_giveaway_attempt_size => 10, :time_zone => 'America - New York'
      )
    end

    it 'should not be valid' do
      @configuration.should_not be_valid
      @configuration.errors[:password].should == ["doesn't match confirmation"]
    end
  end

  describe 'Creation' do
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
      ApplicationSetting['username'].should == 'bill'
      ApplicationSetting['password'].should == 'bob'
      ApplicationSetting['max_giveaway_attempt_size'].should == 10
      ApplicationSetting['time_zone'].identifier.should ==
        'America/New_York'
    end

    it 'should save one Conference' do
      Conference.count.should == 1
      Conference.first.start_date.should == Date.new(2009,5,30)
      Conference.first.end_date.should == Date.new(2009,6,1)
    end
  end

  describe 'Creation when the username is missing' do
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
  
  describe 'Instantiation' do
    it 'creates dates from form params' do
      configuration = Configuration.new(
        'start_date(1i)' => '2013', 'start_date(2i)' => '1',
        'start_date(3i)' => '2'
      )
      configuration.start_date.should == Date.new(2013,1,2)
    end
  end

  describe 'Find' do
    before :all do
      ApplicationSetting.destroy_all
      ApplicationSetting['username'] = 'bill'
      ApplicationSetting['password'] = 'bob'
      ApplicationSetting['max_giveaway_attempt_size'] = 10
      ApplicationSetting['time_zone'] = TZInfo::Timezone.get('America/New_York')
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

  describe 'Updating' do
    before :all do
      ApplicationSetting.destroy_all
      ApplicationSetting['username'] = 'bill'
      ApplicationSetting['password'] = 'bob'
      ApplicationSetting['max_giveaway_attempt_size'] = 10
      ApplicationSetting['time_zone'] = TZInfo::Timezone.get('America/New_York')
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
      ApplicationSetting['username'].should == 'billbill'
      ApplicationSetting['password'].should == 'bobbob'
      ApplicationSetting['max_giveaway_attempt_size'].should == 12
      ApplicationSetting['time_zone'].identifier.should ==
        'America/Denver'
    end

    it 'should update the Conference' do
      conference = Conference.first
      conference.start_date.should == Date.new(2010,5,30)
      conference.end_date.should == Date.new(2010,6,1)
    end
  end

  describe 'Updating when the username is missing' do
    before :all do
      ApplicationSetting.destroy_all
      ApplicationSetting['username'] = 'bill'
      ApplicationSetting['password'] = 'bob'
      ApplicationSetting['max_giveaway_attempt_size'] = 10
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
      ApplicationSetting['username'].should == 'bill'
      ApplicationSetting['password'].should == 'bob'
      ApplicationSetting['max_giveaway_attempt_size'].should == 10
    end

    it 'should not update the Conference' do
      Conference.count.should == 1
      Conference.first.start_date.should == Date.new(2009,5,30)
      Conference.first.end_date.should == Date.new(2009,6,1)
    end
  end

  describe 'Updating when changing the max_giveaway_attempt_size, and not the password' do
    before :all do
      ApplicationSetting.destroy_all
      ApplicationSetting['username'] = 'bill'
      ApplicationSetting['password'] = 'bob'
      ApplicationSetting['max_giveaway_attempt_size'] = 10    
      Conference.destroy_all
      Conference.create!(
        :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1)
      )
    end

    before :each do
      configuration = Configuration.first
      configuration.update_attributes(
        :username => 'bill', :password => '', :password_confirmation => '',
        :start_date => Date.new(2010,5,30), :end_date => Date.new(2010,6,1),
        :max_giveaway_attempt_size => 12,
        :time_zone => TZInfo::Timezone.get('America/New_York')
      )
    end

    it 'should update max_giveaway_attempt_size' do
      ApplicationSetting['max_giveaway_attempt_size'].should == 12
    end

    it 'should not update password' do
      ApplicationSetting['password'].should == 'bob'
    end
  end

  describe 'Updating when the password is being changed but the confirmation is bad' do
    before :all do
      ApplicationSetting.destroy_all
      ApplicationSetting['username'] = 'bill'
      ApplicationSetting['password'] = 'bob'
      ApplicationSetting['max_giveaway_attempt_size'] = 10    
      Conference.destroy_all
      Conference.create!(
        :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1)
      )
    end

    before :each do
      configuration = Configuration.first
      configuration.update_attributes(
        :username => 'bill', :password => 'bizzle', :password_confirmation => 'bizle',
        :start_date => Date.new(2010,5,30), :end_date => Date.new(2010,6,1),
        :max_giveaway_attempt_size => 12
      )
    end

    it 'should not update the password' do
      ApplicationSetting[:password].should == 'bob'
    end
  end
end

