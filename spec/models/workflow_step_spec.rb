require 'spec_helper'

describe WorkflowStep do
  describe '.all' do
    it 'retrieves all WorkflowSteps' do
      WorkflowStep.all.count.should == 7
    end
  end

  describe '#attributes=' do
    before :each do
      ApplicationSetting.destroy_all
    end

    it 'sets appropriate attributes' do
      step = WorkflowStep.all.first
      letters = ('a'..'z').to_a
      new_name = (1..8).to_a.map { letters[rand(letters.size)] }.join
      step.attributes = {name: new_name}
      step.name.should == new_name
    end

    it 'casts boolean values correctly' do
      step = WorkflowStep.all.detect { |s| s.name != 'Configure' }
      step.should be_open
      step.attributes = {open: '0'}
      step.should_not be_open
    end
  end

  describe 'instance' do
    it 'has position and other attributes' do
      step = WorkflowStep.all.first
      step.position.should_not be_nil
      step.description.should_not be_nil
    end
  end
end
