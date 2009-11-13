class AddActiveGiveawaysToGiveawayRounds < ActiveRecord::Migration
  def self.up
    add_column :giveaway_rounds, :active_giveaways, :integer, :default => 0
  end

  def self.down
    remove_column :giveaway_rounds, :active_giveaways
  end
end
