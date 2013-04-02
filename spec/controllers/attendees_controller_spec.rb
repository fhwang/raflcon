require 'spec_helper'

describe AttendeesController do
  describe '/attendees/index/no_giveaway_attempt' do
    integrate_views

    before :all do
      setup_configuration
      @awarded = Attendee.sample :giveaway_attempt => GiveawayAttempt.sample
      @unawarded = Attendee.sample
    end

    before :each do
      login
      get :index, :id => 'no_giveaway_attempt'
    end

    it 'should return the unawarded attendee' do
      json = JSON.parse response.body
      assert json.any? { |rec| rec['id'] == @unawarded.id }
    end

    it 'should not return the unawarded attendee' do
      json = JSON.parse response.body
      assert !json.any? { |rec| rec['id'] == @awarded.id }
    end
  end
end
