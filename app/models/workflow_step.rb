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
      :name => 'Entry giveaway rounds',
      :description => "A giveaway round is a specific date and time when you'll be giving away one or more prizes, usually scheduled between talks. For example, 'Thursday at 10:55 a.m.' might be a giveaway round.",
      :link => '/admin/giveaway_rounds'
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
    closed_steps = ApplicationSetting.value 'closed_workflow_steps'
    unless closed_steps
      closed_steps = [1]
      ApplicationSetting.create!(
        :name => 'closed_workflow_steps', :value => closed_steps
      )
    end
    closed_steps.clone
  end
  
  def self.closed_steps=(cs)
    as = ApplicationSetting.find_by_name 'closed_workflow_steps'
    as ||= ApplicationSetting.new :name => 'closed_workflow_steps'
    as.value = cs
    as.save!
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
