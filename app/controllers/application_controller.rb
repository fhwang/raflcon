# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  protect_from_forgery

  helper :all # include all helpers, all the time

  before_filter :login_required
  
  protected
  
  def login_required
    config_setup_paths = %w(
      /admin/configuration/new /admin/configuration /admin/time_zones
    )
    unless config_setup_paths.include?(request.path)
      username = ApplicationSetting['username']
      password = ApplicationSetting['password']
      if username and password
        authenticate_or_request_with_http_basic do |u, p|
          username == u && password == p
        end
      else
        redirect_to :controller => 'admin/configuration', :action => 'new'
      end
    end
  end
end
