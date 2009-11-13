class GiveawaysController < ApplicationController
  def show
    giveaway = Giveaway.find params[:id]
    render(
      :json => giveaway.to_json(
        :methods => :suggested_attempt_size,
        :include => {:giveaway_attempts => {:include => :attendees}}
      )
    )
  end
  
  def update
    giveaway = Giveaway.find params[:id]
    giveaway.attributes = params[:giveaway]
    giveaway.save
    render :text => ''
  end
end
