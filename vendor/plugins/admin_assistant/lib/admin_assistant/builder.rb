class AdminAssistant
  class Builder
    attr_reader :admin_assistant
    
    def initialize(admin_assistant)
      @admin_assistant = admin_assistant
    end

    def [](column_name)
      ColumnConfigLookup.new(
        column_name,
        [@admin_assistant.base_settings, form, index, show, index.search], 
        @admin_assistant
      )
    end
    
    def actions(*a)
      if a.empty?
        @admin_assistant.actions
      else
        @admin_assistant.actions = a
      end
    end
    
    def destroy(&block)
      @admin_assistant.custom_destroy = block
    end
      
    def form
      f = @admin_assistant.form_settings
      block_given? ? yield(f) : f
    end
      
    def index
      i = @admin_assistant.index_settings
      block_given? ? yield(i) : i
    end
    
    def model_class_name=(mcn)
      @admin_assistant.model_class_name = mcn
    end
    
    def show
      s = @admin_assistant.show_settings
      block_given? ? yield(s) : s
    end
    
    class ColumnConfigLookup
      def initialize(column_name, settingses, admin_assistant)
        @column_name, @settingses, @admin_assistant =
            column_name, settingses, admin_assistant
      end
      
      def method_missing(meth, *args)
        match = meth
        if match.to_s =~ /^(.*)=$/
          match = $1.to_sym
        elsif match.to_s =~ /^(.*)\?$/
          match = $1.to_sym
        end
        setting = @settingses.detect { |setting|
          setting.column_config_fields.keys.include?(match)
        }
        if setting
          setting[@column_name].send(meth, *args)
        else
          super
        end
      end
    end
  end
  
  class ColumnConfig
    def initialize(fields)
      @fields = {}
      fields.each do |fn, value|
        @fields[fn] = value.is_a?(Array) ? value : [value, nil]
      end
      @values = {}
    end
    
    def method_missing_matching_fields_config(meth, block, *args)
      field_type = @fields[meth].first
      if field_type == :accessor
        default_val_or_proc = @fields[meth].last
        if default_val_or_proc.respond_to?(:call)
          default_val_or_proc.call @values[meth]
        else
          @values[meth].nil? ? default_val_or_proc : @values[meth]
        end
      elsif field_type == :boolean
        @values[meth] = true
      elsif field_type == :block
        block ? (@values[meth] = block) : @values[meth]
      end
    end
    
    def find_field_from_method(meth, target_field_type, &block)
      @fields.detect { |fn, tuple|
        meth.to_s =~ block.call(fn) && tuple.first == target_field_type
      }.first
    end
    
    def method_missing_maybe_setter(meth, *args)
      field_name = find_field_from_method(meth, :accessor) { |fn| /^#{fn}=$/ }
      @values[field_name] = args.first if field_name
    end
    
    def method_missing(meth, *args, &block)
      if @fields[meth]
        return method_missing_matching_fields_config(meth, block, *args)
      elsif meth.to_s =~ /=$/
        result = method_missing_maybe_setter(meth, *args)
        return result unless result.nil?
      elsif meth.to_s =~ /\?$/
        field_name = find_field_from_method(meth, :boolean) { |fn|
          /^#{fn}\?$/
        }
        return !@values[field_name].nil? if field_name
      end
      super
    end
  end
  
  class AbstractSettings
    attr_reader :column_names
    
    def initialize(admin_assistant)
      @admin_assistant = admin_assistant
      @column_configs = HashWithIndifferentAccess.new { |h, k|
        h[k] = ColumnConfig.new(column_config_fields)
      }
    end
    
    def [](column_name)
      @column_configs[column_name]
    end
    
    def columns(*args)
      @column_names = args
    end
  end
  
  class BaseSettings < AbstractSettings
    def all_polymorphic_types
      @column_configs.values.map(&:polymorphic_types).flatten.compact
    end
    
    def column_config_fields
      {:boolean_labels => :accessor, :label => :accessor,
       :polymorphic_types => :accessor, :strftime_format => :accessor}
    end
  end
  
  class FormSettings < AbstractSettings
    attr_reader :submit_buttons
    
    def initialize(admin_assistant)
      super
      @submit_buttons = []
    end
    
    def column_config_fields
      {:clear_link => :accessor,
       :datetime_select_options => [:accessor, {}],
       :date_select_options => [:accessor, {}], :default => :block,
       :description => :accessor, :exclude_blank => :boolean,
       :image_size => :accessor, :input => :accessor,
       :read_only => :boolean, :select_choices => :accessor,
       :select_options => [
        :accessor,
        Proc.new { |v|
          v ||= {}
          unless v.has_key?(:include_blank)
            v[:include_blank] = true
          end
          v
        }
       ],
       :text_area_options => [:accessor, {}], :write_once => :boolean
      }
    end
    
    def columns_for_edit(*args)
      if args.empty?
        @columns_for_edit || column_names
      else
        @columns_for_edit = args
      end
    end
    
    def columns_for_new(*args)
      if args.empty?
        @columns_for_new || column_names
      else
        @columns_for_new = args
      end
    end
    
    def column_names
      @column_names || @admin_assistant.default_column_names
    end
  end
  
  class IndexSettings < AbstractSettings
    attr_reader :actions, :right_column_links, :search_settings, :sort_by
    
    def initialize(admin_assistant)
      super
      @actions = ActiveSupport::OrderedHash.new
      @right_column_links = []
      @search_fields = []
      @search_settings = SearchSettings.new @admin_assistant
      @sort_by = "#{admin_assistant.model_class.table_name}.id desc"
      @per_page = 25
    end
    
    def cache_total_entries(time_span = nil)
      time_span ? (@cache_total_entries = time_span) : @cache_total_entries
    end
    
    def column_config_fields
      {:ajax_toggle => :accessor, :image_size => :accessor,
       :link_to_args => :block, :sort_by => :accessor}
    end
    
    def conditions(str = nil, &block)
      if str.nil? && block.nil?
        @conditions
      elsif str
        @conditions = str
      elsif block
        @conditions = block
      end
    end
    
    def header(&block)
      block ? (@header = block) : @header
    end
    
    def include(*associations)
      if associations.empty?
        @include
      else
        @include = associations
      end
    end
    
    def per_page(*args)
      if args.empty?
        @per_page
      else
        @per_page = args.first
      end
    end
    
    def search(*columns)
      if block_given?
        yield @search_settings
      elsif columns.empty?
        @search_settings
      else
        @search_settings.columns *columns
      end
    end
    
    def sort_by(*sb)
      if sb.empty?
        @sort_by
      else
        @sort_by = sb.first
      end
    end
    
    def total_entries(&block)
      block ? (@total_entries = block) : @total_entries
    end
    
    class SearchSettings < AbstractSettings
      attr_reader :column_names
      
      def initialize(admin_assistant)
        super
        @column_names = []
        @default_search_includes = []
      end
      
      def column_config_fields
        {:blank_checkbox => :accessor, :comparators => :accessor,
         :conditions => :block, :field_type => :accessor,
         :match_text_fields_for_association => :boolean}
      end
      
      def columns(*c)
        @column_names = c
      end
    
      def default_search_includes(*includes)
        if includes.empty?
          @default_search_includes
        else
          @default_search_includes = includes
        end
      end
    end
  end
  
  class ShowSettings < AbstractSettings
    attr_reader :model_class_name_block
    
    def column_config_fields
      {}
    end
    
    def model_class_name(&block)
      @model_class_name_block = block
    end
  end
end
