class Admin::GiveawayRoundsController < ApplicationController
  layout 'admin'

  admin_assistant_for GiveawayRound do |aa|
    aa.actions << :destroy
    
    aa.index.columns :time
    aa.index.sort_by :time
    
    aa.form do |form|
      form.multi = true
      form.columns :time
    end
  end
  
  protected
  
  def time_from_form(time)
    time['1-3i'] =~ /(\d{4})-(\d{2})-(\d{2})/
    utc_args = [$1, $2, $3, time['4i'], time['5i']]
    unless utc_args.any?(&:blank?)
      ApplicationSetting['time_zone'].local_to_utc(
        Time.utc(*(utc_args.map(&:to_i)))
      )
    end
  end
end
