class CreatePrizeCategories < ActiveRecord::Migration
  def self.up
    create_table :prize_categories do |t|
      t.string :name
      t.integer :count

      t.timestamps
    end
  end

  def self.down
    drop_table :prize_categories
  end
end
