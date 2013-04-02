class Admin::ConfigurationController < ApplicationController
  layout 'admin'

  def new
    @configuration = ::Configuration.new
  end
  
  def create
    @configuration = ::Configuration.new params_from_post
    if @configuration.save
      redirect_to "/admin"
    else
      render :action => 'new'
    end
  end
  
  def edit
    @configuration = ::Configuration.first
    @configuration.password = nil
  end
  
  def update
    @configuration = ::Configuration.first
    @configuration.attributes = params_from_post
    if @configuration.save
      redirect_to "/admin"
    else
      render :action => 'edit'
    end
  end
  
  protected
  
  def params_from_post
    p = params[:configuration].clone
    tz_friendly_id = p.delete :time_zone
    p[:time_zone] = TZInfo::Timezone.all.detect { |tz|
      tz.friendly_identifier == tz_friendly_id 
    }
    p
  end
end
