require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe Admin::GiveawayRoundsController do
  describe '/admin/giveaway_rounds/create' do
    integrate_views
    
    before :each do
      setup_configuration_and_login
      GiveawayRound.destroy_all
      post(
        :create,
        :giveaway_round => {
          'a' => {
            'time(1-3i)' => '2009-09-30', 'time(4i)' => '15', 'time(5i)' => '45'
          },
          'b' => {'time(1-3i)' => '', 'time(4i)' => '', 'time(5i)' => ''},
          'c' => {'time(1-3i)' => '', 'time(4i)' => '', 'time(5i)' => ''},
          'd' => {'time(1-3i)' => '', 'time(4i)' => '', 'time(5i)' => ''},
          'e' => {'time(1-3i)' => '', 'time(4i)' => '', 'time(5i)' => ''},
          'f' => {'time(1-3i)' => '', 'time(4i)' => '', 'time(5i)' => ''},
          'g' => {'time(1-3i)' => '', 'time(4i)' => '', 'time(5i)' => ''},
          'h' => {'time(1-3i)' => '', 'time(4i)' => '', 'time(5i)' => ''},
          'i' => {'time(1-3i)' => '', 'time(4i)' => '', 'time(5i)' => ''},
          'j' => {'time(1-3i)' => '', 'time(4i)' => '', 'time(5i)' => ''}
        }
      )
    end
    
    it 'should parse customized date select params' do
      GiveawayRound.count.should == 1
      GiveawayRound.last.time.should_not be_nil
    end
    
    it 'should save data in the DB as UTC' do
      GiveawayRound.count(
        :conditions => "time = '2009-09-30 19:45:00.000000'"
      ).should == 1
    end
  end

  describe '/admin/giveaway_rounds/edit' do
    integrate_views
    
    before :all do
      setup_configuration
      conference = Conference.first || Conference.new
      conference.update_attributes!(
        :start_date => Date.new(2009,9,29), :end_date => Date.new(2009,10,1)
      )
      GiveawayRound.destroy_all
      @giveaway_round = GiveawayRound.sample :time => Time.utc(2009,9,30,13,45)
    end
    
    before :each do
      login
      get :edit, :id => @giveaway_round.id
    end
    
    it 'should show a customized date select with restricted day ranges' do
      response.body.should have_selector(
        :xpath, "//select[@name='giveaway_round[time(1-3i)]']"
      ) do
        with_tag    "option[value=?]", "2009-09-29", :text => 'Tue Sep 29 2009'
        with_tag    "option[value=?][selected=selected]", "2009-09-30",
                    :text => 'Wed Sep 30 2009'
        with_tag    "option[value=?]", "2009-10-01", :text => 'Thu Oct 01 2009'
        without_tag "option[value=?]", "2009-10-02", :text => 'Fri Oct 02 2009'
      end
      response.body.should have_selector(
        :xpath, "//select[@name='giveaway_round[time(4i)]']"
      ) do
        with_tag "option[value=00]"
        with_tag "option[value=13][selected=selected]"
        with_tag "option[value=23]"
      end
      response.body.should have_selector(
        :xpath, "//select[@name='giveaway_round[time(5i)]']"
      ) do
        with_tag "option[value=00]"
        with_tag "option[value=45][selected=selected]"
        with_tag "option[value=59]"
      end
    end
  end

  describe '/admin/giveaway_rounds' do
    integrate_views
    
    before :each do
      setup_configuration_and_login
      GiveawayRound.sample :time => Time.utc(2009,9,30,19,45)
      get :index
    end
    
    it 'should display times in the local time zone' do
      response.body.should have_selector(
        'td', :text => /Wed Sep 30 03:45 PM/
      )
    end
  end

  describe '/admin/giveaway_rounds/new' do
    integrate_views
    
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
      response.body.should have_selector(
        :xpath, "//select[@name='giveaway_round[a][time(1-3i)]']"
      ) do
        with_tag    "option[value=?]", "2009-09-29", :text => 'Tue Sep 29 2009'
        with_tag    "option[value=?]", "2009-09-30", :text => 'Wed Sep 30 2009'
        with_tag    "option[value=?]", "2009-10-01", :text => 'Thu Oct 01 2009'
        without_tag "option[value=?]", "2009-10-02", :text => 'Fri Oct 02 2009'
      end
      response.body.should have_selector(
        :xpath, "//select[@name='giveaway_round[a][time(4i)]']"
      ) do
        with_tag "option[value=00]"
        with_tag "option[value=23]"
      end
      response.body.should have_selector(
        :xpath, "//select[@name='giveaway_round[a][time(5i)]']"
      ) do
        with_tag "option[value=00]"
        with_tag "option[value=59]"
      end
    end
  end
end
