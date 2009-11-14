class GiveawayAttemptsController < ApplicationController
  def create
    size = params[:giveaway_attempt].delete(:size).to_i
    if size == 0
      render :nothing => true 
    else
      @giveaway_attempt = GiveawayAttempt.new params[:giveaway_attempt]
      @giveaway_attempt.save
      @giveaway_attempt.attendees = Attendee.find(
        :all,
        :limit => size, :order => 'random()',
        :conditions => "giveaway_attempt_id is null"
      )
      render :json => @giveaway_attempt.to_json(:include => :attendees)
    end
  end
end
