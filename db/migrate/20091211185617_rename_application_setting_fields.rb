class RenameApplicationSettingFields < ActiveRecord::Migration
  def self.up
    rename_column :application_settings, :name, :key
  end

  def self.down
    rename_column :application_settings, :key, :name
  end
end
