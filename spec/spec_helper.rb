# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

RSpec.configure do |config|
  # ## Mock Framework
  #
  # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr

  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_path = "#{::Rails.root}/spec/fixtures"

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # If true, the base class of anonymous controllers will be inferred
  # automatically. This will be the default behavior in future versions of
  # rspec-rails.
  config.infer_base_class_for_anonymous_controllers = false

  # Run specs in random order to surface order dependencies. If you find an
  # order dependency and want to debug it, you can fix the order by providing
  # the seed, which is printed after each run.
  #     --seed 1234
  config.order = "random"
end

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
  config.fixture_path = Rails.root + '/spec/fixtures/'
  config.include SpecMatchers
  include SpecUtilityMethods
end

SampleModels.configure Attendee do |attendee|
  attendee.giveaway_attempt.default nil
end

SampleModels.configure PrizeCategory do |prize_category|
  prize_category.count.default 10
end
