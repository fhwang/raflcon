class Admin::GiveawayRoundsController < ApplicationController
  layout 'admin'

  admin_assistant_for GiveawayRound do |aa|
    aa.actions << :destroy
    
    aa.index.columns :time
    
    aa.form.columns :time
  end
  
  protected
  
  def time_from_form(time)
    time['1-3i'] =~ /(\d{4})-(\d{2})-(\d{2})/
    ApplicationSetting['time_zone'].local_to_utc(
      Time.utc(
        $1.to_i, $2.to_i, $3.to_i, time['4i'].to_i, time['5i'].to_i
      )
    )
  end
end
