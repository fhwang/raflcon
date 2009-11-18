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
    post :import,
         :import => {:names => "Bill Johnson\nJohn Billson\nSon Sonson"}
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

describe "/admin/attendees/import when some of the attendees have already been added" do
  integrate_views
  controller_name 'admin/attendees'
  
  before :all do
    setup_configuration
  end
  
  before :each do
    login
    Attendee.destroy_all
    Attendee.create! :name => 'John Billson'
    post :import,
         :import => {:names => "Bill Johnson\nJohn Billson\nSon Sonson"}
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

describe "/admin/attendees/import while deleting those not in the list" do
  integrate_views
  controller_name 'admin/attendees'
  
  before :all do
    setup_configuration
  end
  
  before :each do
    login
    Attendee.destroy_all
    Attendee.create! :name => 'Olaf Olafsonn'
    post(
      :import,
      :import => {
        :names => "Bill Johnson\nJohn Billson\nSon Sonson",
        :clear_others => '1'
      }
    )
  end
  
  it 'should delete a previously existing attendee' do
    Attendee.find_by_name('Olaf Olafsonn').should be_nil
  end
  
  it 'should import all the attendees' do
    ['Bill Johnson', 'John Billson', 'Son Sonson'].each do |name|
      Attendee.find_by_name(name).should_not be_nil
    end
  end
  
  it 'should redirect to index' do
    response.should redirect_to('/admin/attendees')
  end
end

