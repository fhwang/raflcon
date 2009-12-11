class WorkflowStep < ActiveRecord::BaseWithoutTable
  column :description,  :string
  column :link,         :string
  column :name,         :string
  column :open,         :boolean
  column :position,     :integer
  
  StepAttrs = [
    {
      :description => "Setup general configuration.",
      :link => "/admin/configuration/edit", :name => "Configure"
    },
    {
      :name => 'Enter prize categories',
      :description => "Each prize category is a type of prize. For example, 100 books, or 5 messenger bags, might be one prize category.",
      :link => "/admin/prize_categories"
    },
    {
      :name => 'Enter giveaway rounds',
      :description => "A giveaway round is a specific date and time when you'll be giving away one or more prizes, usually scheduled between talks. For example, 'Thursday at 10:55 a.m.' might be a giveaway round.",
      :link => '/admin/giveaway_rounds'
    },
    {
      :name => 'Enter giveaways',
      :description => "A giveaway is a grouping of one prize category in one giveaway round, for a set amount. For example: '25 books on Thursday at 10:55 a.m.' would be a giveaway. The total of all your giveaways should equal all the amounts on your prize categories.",
      :link => '/admin/giveaways'
    },
    {
      :name => 'Import your attendee list',
      :description => "You can import your final attendee list all at once. If your attendee list isn't finalized yet, you can also import a temporary list just to work with, and then re-import at the last minute when you have the final list.",
      :link => '/admin/attendees'
    },
    {
      :name => "Write your front-end",
      :description => "For the live giveaway experience, raflcon exposes a RESTful API suitable for a custom Ajax front-end. Check out the example provided, and try writing your own. You'll likely find yourself doing lots of test giveaways; that's okay. There's a reset function you can use to roll back test changes before you start using your front-end for real.",
      :link => "/"
    },
    {
      :name => 'Before the conference starts, reset your raflcon instance',
      :description => "This undoes any changes you may have made while testing your front-end.",
      :link => "/admin/reset/new"
    }
  ]
  
  def self.all
    steps = []
    StepAttrs.each_with_index { |step_attr, i|
      attrs = step_attr.clone
      attrs[:position] = i + 1
      attrs = attrs.merge :open => !closed_steps.include?(attrs[:position])
      steps << new(attrs)
    }
    steps
  end
  
  def self.closed_steps
    closed_steps = ApplicationSetting['closed_workflow_steps']
    unless closed_steps
      closed_steps = [1]
      ApplicationSetting['closed_workflow_steps'] = closed_steps
    end
    closed_steps.clone
  end
  
  def self.closed_steps=(cs)
    ApplicationSetting['closed_workflow_steps'] = cs
  end
  
  def self.find_by_position(position)
    all.detect { |workflow_step| workflow_step.position == position.to_i }
  end
  
  def save
    closed = self.class.closed_steps
    if open? && closed.include?(position)
      closed.delete position
    elsif !open? && !closed.include?(position)
      closed << position
    end
    self.class.closed_steps = closed
  end
end
