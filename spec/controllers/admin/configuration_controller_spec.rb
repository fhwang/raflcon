require 'spec_helper'

describe Admin::ConfigurationController do
  describe '/admin/configuration/create' do
    integrate_views
    
    before :all do
      ApplicationSetting.destroy_all
    end
    
    before :each do
      post(
        :create,
        :configuration => {
          :username => 'bill', :password => 'pw3rd',
          :password_confirmation => 'pw3rd',
          :max_giveaway_attempt_size => '10',
          :time_zone => 'America - New York'
        }.merge(date_form_fields('start_date', Date.new(2009,5,23))).merge(
          date_form_fields('end_date', Date.new(2009,5,24))
        )
      )
    end
    
    it 'should be able to map time zones from friendly identifier to identifier' do
      ApplicationSetting[:time_zone].identifier.should == 'America/New_York'
    end

    it 'sets the max_giveaway_attempt_size as an integer' do
      ApplicationSetting[:max_giveaway_attempt_size].should == 10
    end
  end

  describe '/admin/configuration/edit' do
    integrate_views
    
    before :each do
      setup_configuration_and_login
      get :edit
    end
    
    it 'show the friendly identifier for the time zone' do
      response.body.should have_selector(
        :xpath, 
        "//input[@name='configuration[time_zone]'][@value='America - New York']"
      )
    end
    
    it 'should not prefill the password' do
      response.body.should_not have_selector(
        :xpath, "//input[@name='configuration[password]'][@value]"
      )
    end
  end

  describe '/admin/configuration/new when there are no ApplicationSettings' do
    integrate_views
    
    before :all do
      ApplicationSetting.destroy_all
    end
    
    before :each do
      get :new
    end
    
    it 'should not get in an endless redirect loop' do
      response.should be_success
    end
  end

  describe '/admin/configuration/update when not updating the password' do
    integrate_views
    
    before :each do
      setup_configuration_and_login
      post(
        :create,
        :configuration => {
          :username => 'bill', :password => '',
          :password_confirmation => '',
          :max_giveaway_attempt_size => 10, :time_zone => 'America - Los Angeles'
        }.merge(date_form_fields('start_date', Date.new(2009,5,30))).merge(
          date_form_fields('end_date', Date.new(2009,6,1))
        )
      )
    end
    
    it 'should redirect to you to /admin' do
      response.should redirect_to('/admin')
    end
    
    it 'should update the time zone' do
      ApplicationSetting[:time_zone].identifier.should == 'America/Los_Angeles'
    end
    
    it 'should not update the password' do
      ApplicationSetting[:password].should == 'bob'
    end
  end
end
