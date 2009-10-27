require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe 'Giveaway creation when the totals for all giveaways on a prize category are too high' do
  before :all do
    @books = PrizeCategory.sample :name => 'books', :count => 25
    Giveaway.destroy_all
    Giveaway.sample(
      :prize_category => @books,
      :giveaway_round => {:time => Time.utc(2009,5,30,13)},
      :count => 15
    )
  end
  
  before :each do
    @giveaway = Giveaway.new(
      :prize_category => @books,
      :giveaway_round => GiveawayRound.sample(:time => Time.utc(2009,5,30,14)),
      :count => 15, :position => 10
    )
  end
  
  it 'should not validate' do
    @giveaway.should_not be_valid
    @giveaway.errors[:count].should ==
        "can't be more than 10 due to other giveaways for the \"books\" prize category"
  end
end

describe 'Giveaway update when the totals for all giveaways on a prize category are too high' do
  before :all do
    @books = PrizeCategory.sample :name => 'books', :count => 25
    Giveaway.destroy_all
    Giveaway.sample(
      :prize_category => @books,
      :giveaway_round => {:time => Time.utc(2009,5,30,13)},
      :count => 15
    )
    @giveaway = Giveaway.sample(
      :prize_category => @books,
      :giveaway_round => {:time => Time.utc(2009,5,30,14)},
      :count => 10
    )
  end
  
  before :each do
    @giveaway.count = 11
  end
  
  it 'should not validate' do
    @giveaway.should_not be_valid
    @giveaway.errors[:count].should ==
        "can't be more than 10 due to other giveaways for the \"books\" prize category"
  end
end

