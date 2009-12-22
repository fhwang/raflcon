class Admin::PrizeCategoriesController < ApplicationController
  layout 'admin'

  admin_assistant_for PrizeCategory do |aa|
    aa.actions << :destroy
    
    aa.form do |form|
      form.multi = true
      form[:name].description = "For example, 'Books' or 'Messenger bags'."
      form[:count].description = "What's the total number of this kind of prize that you will be giving away during the whole conference?"
    end
  end
end
