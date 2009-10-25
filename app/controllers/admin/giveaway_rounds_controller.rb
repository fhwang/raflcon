class Admin::GiveawayRoundsController < ApplicationController
  layout 'admin'

  admin_assistant_for GiveawayRound
end
