class GiveawayRoundsController < ApplicationController
  def show
    giveaway_round = GiveawayRound.find params[:id]
    render(
      :json => giveaway_round.to_json(
        :include => {:giveaways => {:include => :prize_category}}
      )
    )
  end
end
