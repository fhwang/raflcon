require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe PrizeCategory do
  before(:each) do
    @valid_attributes = {
      :name => "value for name",
      :count => 1
    }
  end

  it "should create a new instance given valid attributes" do
    PrizeCategory.create!(@valid_attributes)
  end
end
