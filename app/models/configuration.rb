class Configuration
  include ActiveModel::Conversion
  include ActiveModel::Validations

  ASBackedColumns = [
    :username, :password, :time_zone, :max_giveaway_attempt_size
  ]

  def self.attr_accessor(*vars)
    @attributes ||= []
    @attributes.concat( vars )
    super
  end

  def self.attributes
    @attributes
  end

  attr_accessor :start_date, :end_date
  attr_accessor *ASBackedColumns

  validates_presence_of :start_date, :end_date
  validates_presence_of *(ASBackedColumns - [:password])
  validates_presence_of :password, :if => :new?
  validates_confirmation_of :password

  def self.create(attributes = {})
    instance = new attributes
    instance.save
  end

  def self.create!(attributes = {})
    instance = new attributes
    instance.save!
  end

  def self.first
    atts = {}
    ASBackedColumns.each do |name, column_type|
      atts[name] = ApplicationSetting[name]
    end
    if conference = Conference.first
      atts[:start_date] = conference.start_date
      atts[:end_date] = conference.end_date
    end
    new atts
  end

  def initialize(attributes={})
    self.attributes = attributes
  end

  def attributes=(attributes)
    attributes = attributes.stringify_keys
    attributes && attributes.each do |name, value|
      if respond_to? name.to_sym
        value = value.to_i if name.to_sym == :max_giveaway_attempt_size
        send("#{name}=", value) 
      end
    end
    %w(start_date end_date).each do |date_attr|
      date_select_fields = %w(1 2 3).map { |num| "#{date_attr}(#{num}i)" }
      if date_select_fields.all? { |date_select_field|
        attributes.has_key?(date_select_field)
      }
        send(
          "#{date_attr}=",
          Date.new(*date_select_fields.map { |date_select_field|
            attributes[date_select_field].to_i
          })
        )
      end
    end
  end

  def new?
    ApplicationSetting.count == 0 and Conference.count == 0
  end

  def persisted?
    false
  end

  def save
    if valid?
      ASBackedColumns.each do |name, column_type|
        unless name == :password && self.password.blank?
          ApplicationSetting[name] = self.send name
        end
      end
      conference = Conference.first || Conference.new
      conference.update_attributes(
        :start_date => start_date, :end_date => end_date
      )
    end
  end

  def save!
    save or raise(ActiveRecord::RecordNotSaved)
  end

  def update_attributes(attributes)
    self.attributes = attributes
    save
  end
end
