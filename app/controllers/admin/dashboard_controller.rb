class Admin::DashboardController < ApplicationController
  layout 'admin'

  before_filter :first_create_conference
  
  protected
  def first_create_conference
    redirect_to "/admin/conferences/new" unless Conference.first
  end
end
