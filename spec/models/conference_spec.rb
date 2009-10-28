require 'spec_helper'

describe 'Conference when trying to create a second conference' do
  before :all do
    Conference.destroy_all
    Conference.create!(
      :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,5,30), 
      :time_zone => 'Eastern Time (US & Canada)'
    )
  end
  
  before :each do
    @conference2 = Conference.new(
      :start_date => Date.new(2010,5,30), :end_date => Date.new(2010,5,30), 
      :time_zone => 'Eastern Time (US & Canada)'
    )
  end
  
  it 'should not allow it' do
    @conference2.should_not be_valid
    @conference2.errors[:base].should ==
        "One conference per Raflcon install, please"
  end
end
