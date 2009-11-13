require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe '/admin/giveaways/order' do
  integrate_views
  controller_name 'admin/giveaways'
  
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

