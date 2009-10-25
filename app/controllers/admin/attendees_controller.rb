class Admin::AttendeesController < ApplicationController
  layout 'admin'

  admin_assistant_for Attendee
end
