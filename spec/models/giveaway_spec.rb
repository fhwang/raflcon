require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe 'Giveaway creation when the totals for all giveaways on a prize category are too high' do
  before :all do
    ApplicationSetting[:time_zone] = TZInfo::Timezone.get('America/New_York')
    @books = PrizeCategory.sample :count => 25
    Giveaway.destroy_all
    Giveaway.sample :prize_category => @books, :count => 15
  end

  before :each do
    @giveaway = Giveaway.new(
      :prize_category => @books, :count => 15, :position => 10
    )
  end

  it 'should not validate' do
    @giveaway.should_not be_valid
    @giveaway.errors[:count].should == [
      "can't be more than 10 due to other giveaways for the \"" +
      @books.name + "\" prize category"
    ]
  end
end

describe 'Giveaway update when the totals for all giveaways on a prize category are too high' do
  before :all do
    ApplicationSetting[:time_zone] = TZInfo::Timezone.get('America/New_York')
    @books = PrizeCategory.sample :count => 25
    Giveaway.destroy_all
    Giveaway.sample :prize_category => @books, :count => 15
    @giveaway = Giveaway.sample(
      :prize_category => @books,
      :giveaway_round => GiveawayRound.sample,
      :count => 10
    )
  end

  before :each do
    @giveaway.count = 11
  end

  it 'should not validate' do
    @giveaway.should_not be_valid
    @giveaway.errors[:count].should == [
      "can't be more than 10 due to other giveaways for the \"" +
      @books.name + "\" prize category"
    ]
  end
end

describe 'Giveaway#suggested_attempt_size when the giveaway size is smaller' do
  before :all do
    ApplicationSetting[:time_zone] = TZInfo::Timezone.get('America/New_York')
    ApplicationSetting[:max_giveaway_attempt_size] = 20
    Giveaway.destroy_all
    @giveaway = Giveaway.sample count: 10, prize_category: {count: 10}
  end

  it 'should be the giveaway size' do
    @giveaway.suggested_attempt_size.should == 10
  end
end

describe 'Giveaway#suggested_attempt_size when the application setting is smaller' do
  before :all do
    ApplicationSetting[:time_zone] = TZInfo::Timezone.get('America/New_York')
    ApplicationSetting[:max_giveaway_attempt_size] = 5
    Giveaway.destroy_all
    @giveaway = Giveaway.sample count: 10, prize_category: {count: 10}
  end

  it 'should be the value set in the application setting' do
    @giveaway.suggested_attempt_size.should == 5
  end
end

describe 'Giveaway creation when active' do
  before :all do
    setup_configuration
    @giveaway_round = GiveawayRound.sample
    @orig_active_giveaways = @giveaway_round.active_giveaways
  end

  before :each do
    Giveaway.create_sample :active => true, :giveaway_round => @giveaway_round
  end

  it 'should increment GiveawayRound#active_giveaways' do
    @giveaway_round.reload
    @giveaway_round.active_giveaways.should == @orig_active_giveaways + 1
  end
end

describe 'Giveaway updating from active to inactive' do
  before :all do
    setup_configuration
    @giveaway = Giveaway.sample :active => true
    @giveaway_round = @giveaway.giveaway_round
    @orig_active_giveaways = @giveaway_round.active_giveaways
  end

  before :each do
    @giveaway.active = false
    @giveaway.save!
  end

  it 'should decrement GiveawayRound#active_giveaways' do
    @giveaway_round.reload
    @giveaway_round.active_giveaways.should == @orig_active_giveaways - 1
  end
end

describe 'Giveaway updating from inactive to active' do
  before :all do
    setup_configuration
    @giveaway = Giveaway.sample :active => false
    @giveaway_round = @giveaway.giveaway_round
    @orig_active_giveaways = @giveaway_round.active_giveaways
  end

  before :each do
    @giveaway.active = true
    @giveaway.save!
  end

  it 'should increment GiveawayRound#active_giveaways' do
    @giveaway_round.reload
    @giveaway_round.active_giveaways.should == @orig_active_giveaways + 1
  end
end

describe 'Giveaway updating from one GiveawayRound to another' do
  before :all do
    setup_configuration
    @giveaway = Giveaway.sample :active => true
    @old_giveaway_round = @giveaway.giveaway_round
    @orig_old_active_giveaways = @old_giveaway_round.active_giveaways
    @new_giveaway_round = GiveawayRound.create_sample
    @orig_new_active_giveaways = @new_giveaway_round.active_giveaways
  end

  before :each do
    @giveaway.giveaway_round = @new_giveaway_round
    @giveaway.save!
  end

  it 'should increment and decrement GiveawayRound#active_giveaways on the correct rounds' do
    @new_giveaway_round.reload
    @new_giveaway_round.active_giveaways.should ==
      @orig_new_active_giveaways + 1
    @old_giveaway_round.reload
    @old_giveaway_round.active_giveaways.should ==
      @orig_old_active_giveaways - 1
  end
end

describe 'Giveaway creation attempt with a missing count' do
  before :all do
    @giveaway = Giveaway.new
  end

  it 'should not be valid' do
    @giveaway.valid?.should be_false
  end
end
