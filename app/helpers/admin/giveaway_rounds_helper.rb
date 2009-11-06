module Admin::GiveawayRoundsHelper
  def time_html_for_index(giveaway_round)
    giveaway_round.pretty_time
  end
end
