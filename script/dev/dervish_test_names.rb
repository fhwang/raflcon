#!/usr/bin/env ruby

require 'pp'

def all_names
  @@all_names ||= 
    begin
      ["AARON", "ABEL", "ADAM", "AIDAN", "AL", "ALEX", "ALEXANDER", "AMAL",
       "AMIN", "AMY", "ANAND", "ANDREW", "ARI", "ARJUN", "AUSTEN", "AVROHOM",
       "BAIRD", "BAKER", "BAKKEN", "BALLABENI", "BANKEWITZ", "BAQUI",
       "BARBEITE", "BAXTER", "BEALE", "BELL", "BENNY", "BERNIER", "BERRY",
       "BETH", "BINNS-SMITH", "BISHOP", "BLAIR", "BLASCO", "BLASIUS", "BOB",
       "BOLING", "BOULET", "BRETT", "BRIAN", "BROWN", "BRYAN", "CALHOUN",
       "CAMPBELL", "CANTRELL", "CANTWELL", "CARAG", "CARVER", "CASHION",
       "CASIMIR", "CHAD", "CHAN", "CHANDRASEKARAN", "CHAUDHURI", "CHESLER",
       "CHIANG", "CHRIS", "CHRYS", "CLINT", "CLUTTON", "CODY", "COHEN",
       "COLLINS", "COLON", "COOK", "COOPERMAN", "CUTRALI", "DAHMER", "DALE",
       "DAMIAN", "DAN", "DANIEL", "DARRYL", "DAVID", "DAVIS", "DEBBIE",
       "DENTZ", "DER", "DEREK", "DEVELOPER", "DHARRIE", "DIGGS", "DIGITAL",
       "DINSHAW", "DISHA", "DUKE", "DUNCAN", "DUVAL", "EDWARDS", "EIRIK",
       "ELIZABETH", "ELKAMMASH", "ENSARI", "ERIC", "FEDERMAN", "FEHR",
       "FELDMAN", "FINDLEY", "FIXLER", "FLEMMING", "FOX", "FRANCO", "FUCHS",
       "GABE", "GALARZA", "GARBER", "GENGLER", "GEORG", "GEORGE", "GESIAK",
       "GESSNER", "GILMAN", "GOBHAI", "GOODSEN", "GORDON", "GOULD", "GRAZIER",
       "GROSSMANN", "GUELPA", "GURUNG", "HAKAN", "HALES", "HANSEN", "HARIS",
       "HARTLAGE", "HEAFITZ", "HERNANDEZ", "HORNE", "HOWERTON", "HOY",
       "HUMMEL", "INFIELD-HARM", "ITO", "J.D.", "JACK", "JACOB", "JACOBO",
       "JADEN", "JAGT", "JAKE", "JAMES", "JARED", "JARI", "JAROS", "JASON",
       "JEARVON", "JEFF", "JEFFREY", "JERONIMO", "JERRED", "JIM", "JJ", "JOE",
       "JOEL", "JOHN", "JOHNSON", "JONATHAN", "JONES", "JORDAN", "JORDIING",
       "JOSE", "JOSEPH", "JUDY", "JUSTIN", "KAFFENBERGER", "KAHN", "KAREEM",
       "KASSAL", "KATZ", "KEESARI", "KEITH", "KEN", "KEVIN", "KINGDON",
       "KLUGE", "KONSTANTIN", "KOUDDOUS", "KRATHWOHL", "KREIMER", "LAR",
       "LARS", "LAUZON", "LECHOW", "LEE", "LEITGEB", "LEO", "LI", "LIN",
       "LOMANTO", "LOPEZ", "LUIS", "LUKE", "MACH", "MACMILLAN", "MADDEN",
       "MARCO", "MARCUS", "MAREK", "MARK", "MARRECK", "MARSHALL", "MARTIN",
       "MARX", "MARY", "MATT", "MATTE", "MATTHEW", "MATTHEWS", "MAZIERSKI",
       "MCNAMEE", "MCQUINN", "MELANIE", "MELIA", "MENARD", "METHOD", "MICHAEL",
       "MITCH", "MOAZENI", "MOCKO", "MOHNEY", "MONJE", "MONTE", "MOREK",
       "MOUDY", "MULDOON", "NADLER", "NATCHEV", "NATE", "NATHAN", "NEWTON",
       "NG", "NICHOLAS", "NIMETY", "NOAH", "NOBLE", "NORA", "NUNEZ",
       "NUSSBAUM", "O'DONNELL", "OBER", "OBUKWELU", "OGATA", "OLIVIER",
       "OLSON", "OUYANG", "PASTORINO", "PATRICK", "PAUL", "PERRY", "PERSEN",
       "PETER", "PHILIP", "PITALE", "PITTS", "POZDENA", "R.T.", "RACHEL",
       "RAKOCZY", "RAMTEKE", "RAQUEL", "RAYMOND", "REBECCA", "REID", "REITZ",
       "RICHMOND", "RIVERA", "ROBBIE", "ROBERT", "RODRIGUEZ", "ROGER",
       "ROGERS", "ROGISH", "ROSS", "RUSSO", "RYAN", "SAM", "SAMUEL", "SANDER",
       "SANTIAGO", "SARA", "SCHEPMAN", "SCHUCK", "SCOTT", "SIMON", "SIMPSON",
       "SINCLAIR", "SMITH", "SOLANO", "SOMMERS", "SPENCER", "SPITZER",
       "STEFAN", "STEFANO", "STEPHENS", "STEVE", "STEVEN", "STEWART", "SUGGS",
       "SUMAN", "SUZANN", "SYKULEV", "T.", "T.J.", "TAYLOR", "THOMAS",
       "THULLBERY", "TIFFANY", "TODD", "TONY", "TROTTER", "TRUDEAU", "VAN",
       "VENU", "VINCENT", "WELLMAN", "WERBELL", "WERNER", "WHITNEY", "WILLIAM",
       "WISZENKO", "WOJCIECH", "WONG", "WOODS", "WU", "YOUNG", "ZACH",
       "ZUNESKA"
      ]
    end
end

def new_line
  max_names = 2 + (rand + rand).round
  names = []
  done = false
  until done
    remaining = $width - names.join(' ').size
    matching_names = all_names.select { |n| n.size <= remaining - 1 }
    if matching_names.empty? || names.size >= max_names
      done = true
    else
      names << matching_names[rand(matching_names.length)]
    end 
  end 
  result = names.join(' ')
  until result.size == $width
    if rand(2) == 0
      result = ' ' + result
    else
      result << ' '
    end
  end
  result
end

def new_result
  result = []
  $height.times do
    result << new_line
  end
  result
end

$width = ARGV.shift.to_i
$height = ARGV.shift.to_i
$result_count = ARGV.shift.to_i
results = []
$result_count.times do 
  results << new_result
end
pp results
