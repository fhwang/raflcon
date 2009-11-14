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
    }
  ]
  
  def self.all
    closed_steps = ApplicationSetting.value 'closed_workflow_steps'
    unless closed_steps
      ApplicationSetting.create!(
        :name => 'closed_workflow_steps', :value => [1]
      )
      closed_steps = [1]
    end
    steps = []
    StepAttrs.each_with_index { |step_attr, i|
      attrs = step_attr.clone
      attrs[:position] = i + 1
      attrs = attrs.merge :open => !closed_steps.include?(attrs[:position])
      steps << new(attrs)
    }
    steps
  end
end
