class Admin::GiveawaysController < ApplicationController
  layout 'admin'

  admin_assistant_for Giveaway
end
