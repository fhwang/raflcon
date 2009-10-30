class Admin::ConfigurationController < ApplicationController
  layout 'admin'

  def new
    @configuration = Configuration.new
  end
  
  def create
    @configuration = Configuration.new params[:configuration]
    if @configuration.save
      redirect_to "/admin"
    else
      render :action => 'new'
    end
  end
  
  def edit
    @configuration = Configuration.first
  end
  
  def update
    @configuration = Configuration.first
    @configuration.attributes = params[:configuration]
    if @configuration.save
      redirect_to "/admin"
    else
      render :action => 'edit'
    end
  end
end
