class AttendeesController < ApplicationController
  def index
    render(
      :json => Attendee.find(
        :all, :conditions => "giveaway_attempt_id is null"
      )
    )
  end
end
