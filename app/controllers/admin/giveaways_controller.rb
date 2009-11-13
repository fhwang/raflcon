class Admin::GiveawaysController < ApplicationController
  layout 'admin'

  admin_assistant_for Giveaway do |aa|
    aa.index do |index|
      index.sort_by 'giveaway_round_id, position'
      index.search :giveaway_round
    end
  end
  
  def order
    params['giveaways_index_tbody'].each_with_index do |id, i|
      Giveaway.update id, :position => i
    end
    render :text => 'Giveaways reordered.'
  end
end
