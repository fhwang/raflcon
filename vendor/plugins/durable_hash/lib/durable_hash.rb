module DurableHash
  mattr_accessor :deserializers
  self.deserializers = Hash.new { |h,durable_hash_class|
    h[durable_hash_class] = {}
  }
  
  def self.deserializer(durable_hash_class, value_class)
    deserializer = deserializers[durable_hash_class][value_class]
    unless deserializer
      match_class = deserializers[durable_hash_class].keys.detect { |klass|
        value_class < klass
      }
      deserializer = deserializers[durable_hash_class][match_class]
    end
    deserializer
  end
  
  mattr_accessor :serializers
  self.serializers = Hash.new { |h,durable_hash_class|
    h[durable_hash_class] = {}
  }
  
  def self.serializer(durable_hash_class, value_class)
    serializer = serializers[durable_hash_class][value_class]
    unless serializer
      match_class = serializers[durable_hash_class].keys.detect { |klass|
        value_class < klass
      }
      serializer = serializers[durable_hash_class][match_class]
    end
    serializer
  end
  
  def self.included(includer)
    def includer.acts_as_durable_hash
      self.validates_uniqueness_of :key
      self.validates_presence_of :key, :value_class
      self.serialize :value
    
      def self.[](key)
        if record = find_by_key(key.to_s)
          record.value
        end
      end
      
      def self.[]=(key, value)
        if record = find_by_key(key.to_s)
          record.value = value
          record.save!
        else
          create! :key => key.to_s, :value => value
        end
      end
      
      self.before_validation do |record|
        record.value_class = record.value.class.name
        serializer = DurableHash.serializer(record.class, record.value.class)
        record.value = serializer.call(record.value) if serializer
      end
      
      define_method(:after_find) do
        if attributes['value_class']
          serializer = DurableHash.deserializer(
            self.class, value_class.constantize
          )
          if serializer
            self.value = serializer.call self.value
          elsif value_class == 'Fixnum'
            self.value = self.value.to_i
          elsif value_class == 'Float'
            self.value = self.value.to_f
          end
        end
      end
      
      if block_given?
        yield DurableHash::Builder.new(self)
      end
    end
  end
  
  class Builder
    def initialize(klass); @klass = klass; end
    
    def deserialize(value_class, &block)
      DurableHash.deserializers[@klass][value_class] = block
    end
    
    def serialize(value_class, &block)
      DurableHash.serializers[@klass][value_class] = block
    end
  end
end

class ActiveRecord::Base
  include DurableHash
end
