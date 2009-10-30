# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password
  
  before_filter :login_required
  
  protected
  
  def login_required
    unless controller_name == 'configuration' &&
           %w(new create).include?(action_name)
      username = ApplicationSetting.value('username')
      password = ApplicationSetting.value('password')
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
