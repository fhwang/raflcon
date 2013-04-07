class Conference < ActiveRecord::Base
  validates_presence_of :end_date
  validates_presence_of :start_date
  validate              :end_date_should_be_after_start_date
  validate              :one_conference_per_raflcon_install

  def as_json(options = nil)
    remaining_attendee_name_max = 
      Attendee.where(giveaway_attempt_id: nil).maximum("length(name)")
    super.merge(
      remaining_attendee_name_max: remaining_attendee_name_max
    )
  end
  
  def end_date_should_be_after_start_date
    if end_date < start_date
      errors.add :end_date, "can't be before the end date"
    end
  end

  def one_conference_per_raflcon_install
    if id.nil? && Conference.first
      errors.add :base, "One conference per Raflcon install, please"
    end
  end
end
