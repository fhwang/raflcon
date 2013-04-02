require 'spec_helper'

describe GiveawayAttemptsController do
  describe '/giveaway_attempts/create' do
    integrate_views

    before :all do
      Attendee.destroy_all
      @giveaway = Giveaway.sample
      Attendee.count.upto(10) do 
        Attendee.create_sample
      end
    end

    before :each do
      setup_configuration_and_login
      @initial_count = GiveawayAttempt.count
      post(
        :create, :giveaway_attempt => {:giveaway_id => @giveaway.id, :size => 10}
      )
    end

    it 'should create a new GiveawayAttempt with that number of attendees' do
      GiveawayAttempt.count.should == @initial_count + 1
      ga = GiveawayAttempt.last
      ga.giveaway.should == @giveaway
      ga.should have(10).attendees
    end

    it 'should return a JSON response' do
      json = JSON.parse response.body
      json.class.should == Hash
    end
  end

  describe "/giveaway_attempt/create when some attendees have won in previous giveaway attempts" do
    integrate_views

    before :all do
      setup_configuration
      Attendee.destroy_all
      earlier_giveaway = Giveaway.sample
      earlier_attempt = GiveawayAttempt.sample :giveaway => earlier_giveaway
      @earlier_winners = []
      10.times do
        @earlier_winners << Attendee.create_sample(
          :giveaway_attempt => earlier_attempt
        )
      end
      @giveaway = Giveaway.sample
      Attendee.create_sample
    end

    before :each do
      setup_configuration_and_login
      post(
        :create, :giveaway_attempt => {:giveaway_id => @giveaway.id, :size => 1}
      )
    end

    it "should not re-assign those attendees to the new giveaway attempt" do
      ga = GiveawayAttempt.last
      assert !@earlier_winners.include?(ga.attendees.first)
    end
  end

  describe "/giveaway_attempt/create when there aren't many non-winning attendees left" do
    integrate_views

    before :all do
      Attendee.destroy_all
      @giveaway = Giveaway.sample
      5.times do
        Attendee.create_sample
      end
    end

    before :each do
      setup_configuration_and_login
      @initial_count = GiveawayAttempt.count
      post(
        :create, :giveaway_attempt => {:giveaway_id => @giveaway.id, :size => 10}
      )
    end

    it 'should create a new GiveawayAttempt only the non-winners' do
      GiveawayAttempt.count.should == @initial_count + 1
      ga = GiveawayAttempt.last
      ga.giveaway.should == @giveaway
      ga.should have(5).attendees
    end
  end

  describe "/giveaway_attempt/create when the size parameter is blank" do
    integrate_views

    before :all do
      setup_configuration
      @giveaway = Giveaway.sample
      Attendee.sample
    end

    before :each do
      setup_configuration_and_login
      @initial_count = GiveawayAttempt.count
      post(
        :create, :giveaway_attempt => {:giveaway_id => @giveaway.id, :size => ''}
      )
    end

    it 'should not create a new GiveawayAttempt' do
      GiveawayAttempt.count.should == @initial_count
    end
  end
end
