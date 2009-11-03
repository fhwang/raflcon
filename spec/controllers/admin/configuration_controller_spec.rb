require 'spec_helper'

describe '/admin/configuration/create' do
  integrate_views
  controller_name 'admin/configuration'
  
  before :all do
    ApplicationSetting.destroy_all
  end
  
  before :each do
    post(
      :create,
      :configuration => {
        :username => 'bill', :password => 'pw3rd',
        :password_confirmation => 'pw3rd',
        :max_giveaway_attempt_size => 10, :time_zone => 'America - New York'
      }.merge(date_form_fields('start_date', Date.new(2009,5,23))).merge(
        date_form_fields('end_date', Date.new(2009,5,24))
      )
    )
  end
  
  it 'should be able to map time zones from friendly identifier to identifier' do
    ApplicationSetting.value('time_zone').identifier.should ==
        'America/New_York'
  end
end

describe '/admin/configuration/edit' do
  integrate_views
  controller_name 'admin/configuration'
  
  before :all do
    ApplicationSetting.sample(
      :name => 'time_zone', :value => TZInfo::Timezone.get('America/New_York'),
      :value_class => 'TZInfo::Timezone'
    )
  end
  
  before :each do
    setup_configuration_and_login
    get :edit
  end
  
  it 'show the friendly identifier for the time zone' do
    response.should have_tag(
      'input[name=?][value=?]', 'configuration[time_zone]',
      'America - New York'
    )
  end
end

describe '/admin/configuration/new when there are no ApplicationSettings' do
  integrate_views
  controller_name 'admin/configuration'
  
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
