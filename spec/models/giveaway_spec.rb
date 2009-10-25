require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Giveaway do
  before(:each) do
    @valid_attributes = {
      :prize_category_id => 1,
      :giveaway_round_id => 1,
      :count => 1,
      :position => 1,
      :active => false
    }
  end

  it "should create a new instance given valid attributes" do
    Giveaway.create!(@valid_attributes)
  end
end
