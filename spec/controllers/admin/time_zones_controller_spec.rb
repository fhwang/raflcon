require 'spec_helper'

describe Admin::TimeZonesController do
  describe "/admin/time_zones when configuration is first being initialized" do
    integrate_views

    before :all do
      ApplicationSetting.destroy_all
    end

    before :each do
      post :index, :configuration => {:time_zone => 'New'}
    end

    it 'should not redirect' do
      response.should be_success
    end
  end
end
