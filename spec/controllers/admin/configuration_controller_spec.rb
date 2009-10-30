require 'spec_helper'

describe 'Admin::ConfigurationController when there are no ApplicationSettings' do
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
