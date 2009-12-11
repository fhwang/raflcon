RAILS_ENV = 'test'
require 'rubygems'
require 'active_record'
require 'active_record/base'
require File.dirname(__FILE__) + '/../lib/durable_hash'

# Configure ActiveRecord
ActiveRecord::Base.logger = Logger.new(File.dirname(__FILE__) + '/debug.log')
ActiveRecord::Base.establish_connection(
  'timeout' => 5000, 'adapter' => 'sqlite3', 'database' => 'spec/test.sqlite3', 
  'pool' => 5
)

# Create the DB schema
silence_stream(STDOUT) do
  ActiveRecord::Schema.define do
    create_table 'application_settings', :force => true do |app_setting|
      app_setting.string 'key'
      app_setting.string 'value'
      app_setting.string 'value_class'
    end
    
    create_table 'customized_settings', :force => true do |app_setting|
      app_setting.string 'key'
      app_setting.string 'value'
      app_setting.string 'value_class'
    end
  end
end

# Define some sample classes
class ApplicationSetting < ActiveRecord::Base
  acts_as_durable_hash
end

module WrapperModule
  class Custom
    attr_accessor :value
  
    def initialize(value); @value = value; end
  end
  
  class SonOfCustom < Custom
  end
end

class CustomizedSetting < ActiveRecord::Base
  acts_as_durable_hash do |dh|
    dh.serialize(WrapperModule::Custom) do |custom|
      custom.value
    end
    dh.deserialize(WrapperModule::Custom) do |data|
      WrapperModule::Custom.new data
    end
  end
end

# Finally some specs
describe "ApplicationSettings that are empty" do
  before :all do
    ApplicationSetting.destroy_all
  end

  it 'should return nil for most everything' do
    ApplicationSetting['foo'].should be_nil
  end
end

describe "ApplicationSetting reading" do
  before :all do
    as = ApplicationSetting.find_or_create_by_key 'foo'
    as.value = 'bar'
    as.save!
  end

  it 'should return the value' do
    ApplicationSetting['foo'].should == 'bar'
  end

  it 'should return the value with a symbol too' do
    ApplicationSetting[:foo].should == 'bar'
  end
end

describe "ApplicationSetting creating" do
  before :each do
    ApplicationSetting.destroy_all
  end
  
  it 'should handle a write' do
    ApplicationSetting['foo'] = 'bar'
    ApplicationSetting['foo'].should == 'bar'
  end
  
  it 'should handle a write with a symbol' do
    ApplicationSetting[:foo] = 'bar'
    ApplicationSetting['foo'].should == 'bar'
  end
end

describe "ApplicationSetting updating" do
  before :each do
    ApplicationSetting.destroy_all
    ApplicationSetting.create! :key => 'foo', :value => 'bar'
  end
  
  it 'should handle a write' do
    ApplicationSetting['foo'] = 'baz'
    ApplicationSetting['foo'].should == 'baz'
  end
end

describe "ApplicationSetting uniqueness" do
  before :all do
    ApplicationSetting.destroy_all
    ApplicationSetting.create! :key => 'foo', :value => 'bar'
  end
  
  it 'should be set on key automatically' do
    lambda {
      ApplicationSetting.create!(:key => 'foo', :value => 'baz')
    }.should raise_error
  end
  
  it 'should prevent new instances from being seen as valid' do
    ApplicationSetting.new(:key => 'foo', :value => 'baz').should_not be_valid
  end
end

describe 'ApplicationSetting with an integer' do
  before :all do
    ApplicationSetting.destroy_all
  end
  
  it 'should read and write as an integer' do
    ApplicationSetting['foo'] = 123
    ApplicationSetting['foo'].should == 123
  end
end

describe 'ApplicationSetting with a float' do
  before :all do
    ApplicationSetting.destroy_all
  end
  
  it 'should read and write as a float' do
    ApplicationSetting['foo'] = 123.0
    ApplicationSetting['foo'].class.should == Float
    ApplicationSetting['foo'].should be_close(123.0, 0.00001)
  end
end

describe 'ApplicationSetting with an array' do
  before :all do
    ApplicationSetting.destroy_all
  end
  
  it 'should read and write as a float' do
    ApplicationSetting['foo'] = [1,2,3]
    ApplicationSetting['foo'].should == [1,2,3]
  end
end

describe 'ApplicationSetting.valid? for a new instance' do
  before :all do
    ApplicationSetting.destroy_all
  end

  it 'should not need a value_class to be explicitly set' do
    app_setting = ApplicationSetting.new :key => 'username', :value => 'bob'
    app_setting.should be_valid
  end
end

describe 'CustomizedSetting custom serialization' do
  before :each do
    CustomizedSetting.destroy_all
  end
  
  it 'should save with a custom serialization' do
    CustomizedSetting['foo'] = WrapperModule::Custom.new('bar')
    find_by_sql_results = CustomizedSetting.find_by_sql(
      "select * from customized_settings where value = 'bar'"
    )
    find_by_sql_results.size.should == 1
  end
  
  it 'should load with a custom serialization' do
    CustomizedSetting.connection.execute(
      'INSERT INTO customized_settings ("value_class", "value", "key") VALUES("WrapperModule::Custom", "bar", "foo")'
    )
    value = CustomizedSetting['foo']
    value.class.should == WrapperModule::Custom
    value.value.should == 'bar'
  end
  
  it 'should not try to mess with a normal value' do
    CustomizedSetting['baz'] = 'fiz'
    CustomizedSetting['baz'].should == 'fiz'
  end
  
  it 'should use custom serialization for any subclasses of Custom too' do
    CustomizedSetting['foo'] = WrapperModule::SonOfCustom.new('bar')
    find_by_sql_results = CustomizedSetting.find_by_sql(
      "select * from customized_settings where value = 'bar'"
    )
    find_by_sql_results.size.should == 1
    value = CustomizedSetting['foo']
    value.class.should == WrapperModule::Custom
    value.value.should == 'bar'
  end
end
