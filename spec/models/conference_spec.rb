require 'spec_helper'

describe 'Conference with a start_date after the end_date' do
  before :each do
    @conference = Conference.new(
      :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,4,1)
    )
  end

  it 'should be invalid' do
    @conference.should_not be_valid
    @conference.errors[:end_date].should == ["can't be before the end date"]
  end
end

describe 'Conference when trying to create a second conference' do
  before :all do
    Conference.destroy_all
    Conference.create!(
      :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,5,30)
    )
  end

  before :each do
    @conference2 = Conference.new(
      :start_date => Date.new(2010,5,30), :end_date => Date.new(2010,5,30)
    )
  end

  it 'should not allow it' do
    @conference2.should_not be_valid
    @conference2.errors[:base].should == [ 
      "One conference per Raflcon install, please"
    ]
  end
end
