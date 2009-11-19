require 'spec_helper'

describe '/admin/reset/create' do
  integrate_views
  controller_name 'admin/reset'
  
  before :all do
    setup_configuration
  end
  
  before :each do
    ga1 = GiveawayAttempt.create_sample
    ga2 = GiveawayAttempt.create_sample
    Attendee.sample :giveaway_attempt => ga2
    giveaway = Giveaway.sample :active => false
    @giveaway_round = giveaway.giveaway_round
    @gr_active_giveaways_before = @giveaway_round.active_giveaways
    login
    post :create
  end
  
  it 'should delete all giveaway attempts' do
    GiveawayAttempt.count.should == 0
  end
  
  it 'should update all giveaways to be active' do
    Giveaway.find(:all, :conditions => {:active => false}).size.should == 0
  end
  
  it 'should nilify giveaway_attempt_id on all attendees' do
    Attendee.find(
      :all, :conditions => "giveaway_attempt_id is not null"
    ).size.should == 0
  end
  
  it 'should change GiveawayRound#active_giveaways, as a consequence of activating all giveaways' do
    @giveaway_round.reload
    @giveaway_round.active_giveaways.should_not == @gr_active_giveaways_before
  end
end

