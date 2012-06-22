#!/usr/bin/env ruby

unless ARGV.size == 1
  puts "import_two_column_csv.rb [file]"
  exit
end

require File.expand_path('../../../config/boot',  __FILE__)
require File.expand_path('../../../config/environment',  __FILE__)
require 'csv'

first_row = true
CSV.open(ARGV.first).each do |row|
  if first_row
    first_row = false
  else
    fname = row[0]
    lname = row[1]
    Attendee.create(:name => [fname, lname].join(' '))
  end
end

