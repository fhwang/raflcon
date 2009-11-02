class GiveawaysController < ApplicationController
  def show
    giveaway = Giveaway.find params[:id]
    render(
      :json => giveaway.to_json(
        :include => {:giveaway_attempts => {:methods => :size}}
      )
    )
  end
end
