Raflcon::Application.routes.draw do
  match 'conference' => 'conference#show'

  match 'admin' => 'admin/workflow_steps#index'
  match 'admin/configuration/edit' => 'admin/configuration#edit'
  match 'admin/configuration/update' => 'admin/configuration#update'
  match 'admin/attendees/import' => 'admin/attendees#import'

  namespace :admin do
    resources :attendees, :configuration, :giveaway_rounds, :giveaways,
              :prize_categories, :reset, :time_zones
  end

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  match ':controller(/:action(/:id(.:format)))'
end
