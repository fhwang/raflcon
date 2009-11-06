require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe '/admin/giveaway_rounds/create' do
  integrate_views
  controller_name 'admin/giveaway_rounds'
  
  before :all do
    ApplicationSetting.sample(
      :name => 'time_zone', :value_class => 'TZInfo::Timezone',
      :value => TZInfo::Timezone.get('America/New_York')
    )
  end
  
  before :each do
    setup_configuration_and_login
    GiveawayRound.destroy_all
    post(
      :create,
      :giveaway_round => {
        :time => {'1-3i' => '2009-09-30', '4i' => '15', '5i' => '45'}
      }
    )
  end
  
  it 'should parse customized date select params' do
    GiveawayRound.count.should == 1
    GiveawayRound.last.time.should_not be_nil
  end
  
  it 'should save data in the DB as UTC' do
    GiveawayRound.count(
      :conditions => "time = '2009-09-30 19:45:00'"
    ).should == 1
  end
end

describe '/admin/giveaway_rounds/edit' do
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
    setup_configuration_and_login
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

describe '/admin/giveaway_rounds/new' do
  integrate_views
  controller_name 'admin/giveaway_rounds'
  
  before :all do
    conference = Conference.first || Conference.new
    conference.update_attributes!(
      :start_date => Date.new(2009,9,29), :end_date => Date.new(2009,10,1)
    )
  end
  
  before :each do
    setup_configuration_and_login
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

