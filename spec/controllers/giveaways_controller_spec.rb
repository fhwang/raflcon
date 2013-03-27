require 'spec_helper'

describe GiveawaysController do
  describe "/giveaways/update when disabling" do
    integrate_views

    before :all do
      setup_configuration
      @giveaway = Giveaway.sample
    end

    before :each do
      login
      post :update, :id => @giveaway.id, :giveaway => {:active => '0'}
    end

    it 'should make the giveaway inactive' do
      @giveaway.reload
      @giveaway.should_not be_active
    end

    it 'should return JSON for the updated Giveaway' do
      json = JSON.parse response.body
      json['giveaway'].should_not be_nil
      json['giveaway']['giveaway_round']['active_giveaways'].should ==
        @giveaway.giveaway_round(true).active_giveaways
    end
  end
end
