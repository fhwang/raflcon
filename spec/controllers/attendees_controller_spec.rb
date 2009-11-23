require 'spec_helper'

describe '/attendees/index/no_giveaway_attempt' do
  integrate_views
  controller_name 'attendees'
  
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
    assert json.any? { |rec| rec['attendee']['id'] == @unawarded.id }
  end
  
  it 'should not return the unawarded attendee' do
    json = JSON.parse response.body
    assert !json.any? { |rec| rec['attendee']['id'] == @awarded.id }
  end
end

