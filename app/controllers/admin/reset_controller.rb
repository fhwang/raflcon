class Admin::ResetController < ApplicationController
  layout 'admin'
  
  def create
    GiveawayAttempt.destroy_all
    Giveaway.update_all :active => true
    Attendee.update_all :giveaway_attempt_id => nil
    GiveawayRound.update_active_giveaways
    redirect_to :controller => 'admin/workflow_steps', :action => 'index'
  end
end
