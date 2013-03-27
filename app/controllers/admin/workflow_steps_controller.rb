class Admin::WorkflowStepsController < ApplicationController
  layout 'admin'

  before_filter :first_create_conference
  
  def index
    @workflow_steps = WorkflowStep.all.sort_by &:position
  end
  
  def update
    @workflow_step = WorkflowStep.find_by_position params[:id]
    @workflow_step.attributes = params[:workflow_step]
    @workflow_step.save
    render partial: 'show.html.erb', locals: {workflow_step: @workflow_step}
  end
  
  protected
  def first_create_conference
    redirect_to "/admin/conferences/new" unless Conference.first
  end
end
