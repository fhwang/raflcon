class Admin::AttendeesController < ApplicationController
  layout 'admin'

  admin_assistant_for Attendee do |aa|
    aa.actions << :destroy
    
    aa.form.columns :name
  end
  
  def import
    Attendee.destroy_all if params[:import][:clear_others] == '1'
    params[:import][:names].each_line do |line|
      name = line.chomp.strip
      Attendee.find_or_create_by_name name
    end
    redirect_to :action => 'index'
  end
end
