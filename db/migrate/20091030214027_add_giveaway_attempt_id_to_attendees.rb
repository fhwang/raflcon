class AddGiveawayAttemptIdToAttendees < ActiveRecord::Migration
  def self.up
    add_column :attendees, :giveaway_attempt_id, :integer
  end

  def self.down
    remove_column :attendees, :giveaway_attempt_id
  end
end
