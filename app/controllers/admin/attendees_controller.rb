class Admin::AttendeesController < ApplicationController
  layout 'admin'

  admin_assistant_for Attendee do |aa|
    aa.actions << :destroy
  end
  
  def import
    params[:import].each_line do |line|
      name = line.chomp.strip
      Attendee.create! :name => name
    end
    redirect_to :action => 'index'
  end
end
