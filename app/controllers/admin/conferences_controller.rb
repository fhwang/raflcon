class Admin::ConferencesController < ApplicationController
  layout 'admin'

  def new
    @conference = Conference.new
  end
  
  def create
    @conference = Conference.new params[:conference]
    if @conference.save
      redirect_to "/admin"
    else
      render_action 'new'
    end
  end
  
  def edit
    @conference = Conference.find params[:id]
  end
  
  def update
    @conference = Conference.find params[:id]
    @conference.attributes = params[:conference]
    if @conference.save
      redirect_to "/admin"
    else
      render_action 'edit'
    end
  end
end
