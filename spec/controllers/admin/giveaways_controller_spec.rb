require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe Admin::GiveawaysController do
  describe '/admin/giveaways/new' do
    integrate_views
    
    before :all do
      GiveawayRound.destroy_all
    end
    
    before :each do
      setup_configuration_and_login
      @round2 = GiveawayRound.sample :time => Time.local(2010, 5, 22, 16, 0, 0)
      @round1 = GiveawayRound.sample :time => Time.local(2010, 5, 22, 9, 0, 0)
      get :new
      response.should be_success
    end
    
    it 'should order giveaway rounds by time' do
      response.body.should have_selector(
        :xpath, "//select[@name='giveaway[a][giveaway_round_id]']"
      ) do
        with_tag 'option:first-child[value=""]'
        with_tag 'option:nth-child(2)[value=?]', @round1.id
        with_tag 'option:nth-child(3)[value=?]', @round2.id
      end
    end
  end

  describe '/admin/giveaways/order' do
    integrate_views
    
    before :each do
      setup_configuration_and_login
      @giveaway1 = Giveaway.sample :position => 2
      @giveaway2 = Giveaway.create_sample(
        :position => 1, :giveaway_round => @giveaway1.giveaway_round
      )
      @giveaway1.id.should_not == @giveaway2.id
      post :order,
           :giveaways_index_tbody => [@giveaway1.id.to_s, @giveaway2.id.to_s]
      response.should be_success
    end
    
    it 'should reorder the giveaways within one round' do
      @giveaway1.reload
      @giveaway1.position.should == 0
      @giveaway2.reload
      @giveaway2.position.should == 1
    end
  end
end
