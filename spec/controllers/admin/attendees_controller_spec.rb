require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe "/admin/attendees/import" do
  integrate_views
  controller_name 'admin/attendees'
  
  before :all do
    setup_configuration
  end
  
  before :each do
    login
    Attendee.destroy_all
    post :import, :import => "Bill Johnson\nJohn Billson\nSon Sonson"
  end
  
  it 'should import all the attendees' do
    Attendee.count.should == 3
    ['Bill Johnson', 'John Billson', 'Son Sonson'].each do |name|
      Attendee.find_by_name(name).should_not be_nil
    end
  end
  
  it 'should redirect to index' do
    response.should redirect_to('/admin/attendees')
  end
end

