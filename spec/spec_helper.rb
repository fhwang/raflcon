# This file is copied to ~/spec when you run 'ruby script/generate rspec'
# from the project root directory.
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path(File.join(File.dirname(__FILE__),'..','config','environment'))
require 'spec/autorun'
require 'spec/rails'

# Uncomment the next line to use webrat's matchers
#require 'webrat/integrations/rspec-rails'

# Requires supporting files with custom matchers and macros, etc,
# in ./support/ and its subdirectories.
Dir[File.expand_path(File.join(File.dirname(__FILE__),'support','**','*.rb'))].each {|f| require f}

module SpecMatchers
  class HaveAttributes
    def initialize( expected )
      @expected = expected
    end
    
    def matches?( target )
      @target = target
      unless @target.nil?
        @failures = []
        @failures = @expected.select { |name, value|
          @target.send( name ) != value
        }
      end
      !@target.nil? && @failures.empty?
    end
    
    def failure_message
      if @target.nil?
        "expected target to not be nil"
      else
        "expected #{ @target.inspect } to have values " +
        @failures.collect { |name, value|
          "#{ name }:#{ value.inspect }"
        }.join( ', ' )
      end
    end
  end
  
  def have_attributes( expected )
    HaveAttributes.new expected
  end
end

module SpecUtilityMethods
  def date_form_fields( field, date )
    { "#{ field }(1i)" => date.year.to_s, "#{ field }(2i)" => date.month.to_s,
      "#{ field }(3i)" => date.day.to_s }
  end
  
  def login
    username = ApplicationSetting['username']
    password = ApplicationSetting['password']
    @request.env['HTTP_AUTHORIZATION'] =
      'Basic ' + Base64::encode64("#{username}:#{password}")
  end
  
  def setup_configuration
    ApplicationSetting['time_zone'] = TZInfo::Timezone.get('America/New_York')
    ApplicationSetting['username'] ||= 'bill'
    ApplicationSetting['password'] ||= 'bob'
    unless Conference.first
      Conference.create!(
        :start_date => Date.new(2009,5,30), :end_date => Date.new(2009,6,1)
      )
    end
  end
  
  def setup_configuration_and_login
    setup_configuration
    login
  end
end

Spec::Runner.configure do |config|
  config.use_transactional_fixtures = true
  config.use_instantiated_fixtures  = false
  config.fixture_path = RAILS_ROOT + '/spec/fixtures/'
  config.include SpecMatchers
  include SpecUtilityMethods
end

SampleModels.configure Attendee do |attendee|
  attendee.default.giveaway_attempt nil
end

SampleModels.configure PrizeCategory do |prize_category|
  prize_category.default.count 10
end
