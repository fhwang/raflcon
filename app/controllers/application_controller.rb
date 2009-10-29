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
    password_file = "#{RAILS_ROOT}/config/http_basic_auth/#{RAILS_ENV}"
    if File.exist?(password_file)
      lines = File.read(password_file).split
      u = lines.first.chomp
      p = lines[1].chomp
      authenticate_or_request_with_http_basic do |username, password|
        username == u && password == p
      end
    end
  end
end
