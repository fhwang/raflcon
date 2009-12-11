require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe 'GiveawayRound creation when time is set to UTC' do
  before :all do
    ApplicationSetting[:time_zone] = TZInfo::Timezone.get('America/New_York')
  end

  before :each do
    GiveawayRound.destroy_all
    @giveaway_round = GiveawayRound.create! :time => Time.utc(2009,9,30,19,45)
  end
  
  it 'should save the UTC values in the DB' do
    GiveawayRound.count(
      :conditions => "time = '2009-09-30 19:45:00'"
    ).should == 1
  end
end

