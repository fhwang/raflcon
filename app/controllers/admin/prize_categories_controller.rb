class Admin::PrizeCategoriesController < ApplicationController
  layout 'admin'

  admin_assistant_for PrizeCategory
end
