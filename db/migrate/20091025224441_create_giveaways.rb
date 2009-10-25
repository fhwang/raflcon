class CreateGiveaways < ActiveRecord::Migration
  def self.up
    create_table :giveaways do |t|
      t.integer :prize_category_id
      t.integer :giveaway_round_id
      t.integer :count
      t.integer :position
      t.boolean :active, :default => true

      t.timestamps
    end
  end

  def self.down
    drop_table :giveaways
  end
end
