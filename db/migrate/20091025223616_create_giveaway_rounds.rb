class CreateGiveawayRounds < ActiveRecord::Migration
  def self.up
    create_table :giveaway_rounds do |t|
      t.datetime :time

      t.timestamps
    end
  end

  def self.down
    drop_table :giveaway_rounds
  end
end
