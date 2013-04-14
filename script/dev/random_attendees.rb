#!/usr/bin/env ruby

unless ARGV.size == 1
  puts "random_attendees.rb [number]"
  exit
end

first_names = %w(
  Alex Alfonso Allen Alpha Aman Ari Brad Brian Chad Chris Clifford Courtenay
  Dan Dave David Duncan Elliott Gary Jim John Kevin Lee Luke Marcy Matthew 
  Meibell Michael Miguel Mike Ned Noah Paul Peter Raquel Sean Sebastian Tim
  Toby Tom Wilson
)
last_names = %w(
  Hodel Jacklone James Jaros Kaffenberger Katz Khattri Kidwell Kline Kudria
  Lade Lan Larrimore Lauzon Leitgeb Liu Maher Mango Matarese Maximov McFarland 
  McKay McNamara Melia Menard Michael Mill Mistry Moreno Mornini Mueller
  Muldoon Nakajima Ngo Niles Nussbaum Nutt O'Brien Ocampo-Gooding Olson 
)
picked = {}
until picked.size == ARGV.first.to_i
  name = [
    first_names[rand(first_names.size)], last_names[rand(last_names.size)]
  ].join ' '
  unless picked[name]
    puts name
    picked[name] = true
  end
end
