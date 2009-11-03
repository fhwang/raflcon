class AddValueClassToApplicationSettings < ActiveRecord::Migration
  def self.up
    add_column :application_settings, :value_class, :string
  end

  def self.down
    remove_column :application_settings, :value_class
  end
end
