class Admin::WorkflowStepsController < ApplicationController
  layout 'admin'

  before_filter :first_create_conference
  
  def index
    @workflow_steps = WorkflowStep.all.sort_by &:position
  end
  
  protected
  def first_create_conference
    redirect_to "/admin/conferences/new" unless Conference.first
  end
end
