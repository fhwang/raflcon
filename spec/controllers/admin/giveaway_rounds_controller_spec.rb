require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe 'Admin::GiveawayRoundsController#create' do
  integrate_views
  controller_name 'admin/giveaway_rounds'
  
  before :all do
    GiveawayRound.destroy_all "time = '2009-09-30 15:45:00'"
  end
  
  before :each do
    @orig_count = GiveawayRound.count
    post(
      :create,
      :giveaway_round => {
        :time => {'1-3i' => '2009-09-30', '4i' => '15', '5i' => '45'}
      }
    )
  end
  
  it 'should parse customized date select params' do
    GiveawayRound.count.should == @orig_count + 1
    GiveawayRound.last.time.should == Time.utc(2009,9,30,15,45)
  end
end

describe 'Admin::GiveawayRoundsController#edit' do
  integrate_views
  controller_name 'admin/giveaway_rounds'
  
  before :all do
    conference = Conference.first || Conference.new
    conference.update_attributes!(
      :start_date => Date.new(2009,9,29), :end_date => Date.new(2009,10,1)
    )
    @giveaway_round = GiveawayRound.sample :time => Time.utc(2009,9,30,13,45)
  end
  
  before :each do
    get :edit, :id => @giveaway_round.id
  end
  
  it 'should show a customized date select with restricted day ranges' do
    response.should have_tag('select[name=?]', 'giveaway_round[time][1-3i]') do
      with_tag    "option[value=?]", "2009-09-29", :text => 'Tue Sep 29 2009'
      with_tag    "option[value=?][selected=selected]", "2009-09-30",
                  :text => 'Wed Sep 30 2009'
      with_tag    "option[value=?]", "2009-10-01", :text => 'Thu Oct 01 2009'
      without_tag "option[value=?]", "2009-10-02", :text => 'Fri Oct 02 2009'
    end
    response.should have_tag('select[name=?]', 'giveaway_round[time][4i]') do
      with_tag "option[value=00]"
      with_tag "option[value=13][selected=selected]"
      with_tag "option[value=23]"
    end
    response.should have_tag('select[name=?]', 'giveaway_round[time][5i]') do
      with_tag "option[value=00]"
      with_tag "option[value=45][selected=selected]"
      with_tag "option[value=59]"
    end
  end
end

describe 'Admin::GiveawayRoundsController#new' do
  integrate_views
  controller_name 'admin/giveaway_rounds'
  
  before :all do
    conference = Conference.first || Conference.new
    conference.update_attributes!(
      :start_date => Date.new(2009,9,29), :end_date => Date.new(2009,10,1)
    )
  end
  
  before :each do
    get :new
  end
  
  it 'should show a customized date select with restricted day ranges' do
    response.should have_tag('select[name=?]', 'giveaway_round[time][1-3i]') do
      with_tag    "option[value=?]", "2009-09-29", :text => 'Tue Sep 29 2009'
      with_tag    "option[value=?]", "2009-09-30", :text => 'Wed Sep 30 2009'
      with_tag    "option[value=?]", "2009-10-01", :text => 'Thu Oct 01 2009'
      without_tag "option[value=?]", "2009-10-02", :text => 'Fri Oct 02 2009'
    end
    response.should have_tag('select[name=?]', 'giveaway_round[time][4i]') do
      with_tag "option[value=00]"
      with_tag "option[value=23]"
    end
    response.should have_tag('select[name=?]', 'giveaway_round[time][5i]') do
      with_tag "option[value=00]"
      with_tag "option[value=59]"
    end
  end
end

