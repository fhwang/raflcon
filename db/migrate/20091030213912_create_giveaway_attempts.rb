class CreateGiveawayAttempts < ActiveRecord::Migration
  def self.up
    create_table :giveaway_attempts do |t|
      t.integer :giveaway_id

      t.timestamps
    end
  end

  def self.down
    drop_table :giveaway_attempts
  end
end
