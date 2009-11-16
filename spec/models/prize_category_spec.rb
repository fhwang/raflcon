require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe 'PrizeCategory.unfilled when there are no giveaways' do
  before :all do
    Giveaway.destroy_all
    @books = PrizeCategory.sample :name => 'Books', :count => 150
    @messenger_bags = PrizeCategory.sample(
      :name => 'Messenger bags', :count => 5
    )
    @unfilled = PrizeCategory.unfilled
  end
  
  it 'should return all categories with the counts needed' do
    @unfilled.should include(@books)
    @unfilled.detect { |pc| pc.id == @books.id }.unfilled_count.should == 150
    @unfilled.should include(@messenger_bags)
    @unfilled.detect { |pc|
      pc.id == @messenger_bags.id
    }.unfilled_count.should == 5
  end
end

describe 'PrizeCategory.unfilled when there are some giveaways' do
  before :all do
    Giveaway.destroy_all
    @books = PrizeCategory.sample :name => 'Books', :count => 150
    @messenger_bags = PrizeCategory.sample(
      :name => 'Messenger bags', :count => 5
    )
    Giveaway.sample :prize_category => @books, :count => 25
    Giveaway.sample :prize_category => @messenger_bags, :count => 5
    @unfilled = PrizeCategory.unfilled
  end
  
  it 'should return a category that still needs more giveaways' do
    @unfilled.should include(@books)
    @unfilled.detect { |pc| pc.id == @books.id }.unfilled_count.should == 125
  end
  
  it "should not return a category that has all the giveaways it needs" do
    @unfilled.should_not include(@messenger_bags)
  end
end

describe 'PrizeCategory.unfilled when there everything has been filled' do
  before :all do
    Giveaway.destroy_all
    @books = PrizeCategory.sample :name => 'Books', :count => 150
    @messenger_bags = PrizeCategory.sample(
      :name => 'Messenger bags', :count => 5
    )
    Giveaway.sample :prize_category => @books, :count => 150
    Giveaway.sample :prize_category => @messenger_bags, :count => 5
    @unfilled = PrizeCategory.unfilled
  end
  
  it 'should not return any categories' do
    @unfilled.should_not include(@books)
    @unfilled.should_not include(@messenger_bags)
  end
end
