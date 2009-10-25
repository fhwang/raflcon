#!/usr/local/bin/ruby
unless ARGV.size == 1
  puts "import.rb [file]"
  exit
end

require 'config/environment'

File.read(ARGV.first).each do |line|
  name = line.chomp.strip
  Attendee.create! :name => name
end