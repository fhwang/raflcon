class Conference < ActiveRecord::Base
  validates_presence_of :end_date
  validates_presence_of :start_date
  validates_presence_of :time_zone
  
  def validate
    if id.nil? && Conference.first
      errors.add_to_base "One conference per Raflcon install, please"
    end
  end
end
