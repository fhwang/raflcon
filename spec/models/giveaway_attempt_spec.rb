require 'spec_helper'

describe GiveawayAttempt do
  before(:each) do
    @valid_attributes = {
      :giveaway_id => 1
    }
  end

  it "should create a new instance given valid attributes" do
    GiveawayAttempt.create!(@valid_attributes)
  end
end
