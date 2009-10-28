class Conference < ActiveRecord::Base
  validates_presence_of :end_date
  validates_presence_of :start_date
  
  def validate
    if id.nil? && Conference.first
      errors.add_to_base "One conference per Raflcon install, please"
    end
    if end_date < start_date
      errors.add :end_date, "can't be before the end date"
    end
  end
end
