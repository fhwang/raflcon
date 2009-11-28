GiveawayAttemptView = Class.create();
GiveawayAttemptView.prototype = {
  initialize: function(red_herrings, giveaway_attempt) {
    this.red_herrings = red_herrings;
    this.giveaway_attempt = giveaway_attempt;
  },
  
  animate: function() {
    slots_html = "";
    for (i = 0; i < this.giveaway_attempt.attendees.length; i++) {
      slots_html = slots_html + "<div id='slot_" + i + "' class='slot'></div>";
    }
    slots_html = slots_html + "<br style='clear:both'>";
    $('newest_giveaway_attempt').innerHTML = slots_html;
    this.slots = [];
    this.giveaway_attempt.attendees.each(function(winner, index) {
      this.slots.push(new GiveawayAttemptView.Slot(
        index, winner, this.red_herrings
      ));
    }.bind(this));
    this.interval_id = setInterval(this.tick.bind(this), 10)
  },
  
  tick: function() {
    this.slots.each(function(s) { s.tick(); });
    if (this.slots.all(function(s) { return s.done; })) {
      clearInterval(this.interval_id);
    }
  }
};

GiveawayAttemptView.Slot = Class.create();
GiveawayAttemptView.Slot.prototype = {
  initialize: function(index, winner, all_red_herrings) {
    this.done = false;
    this.frames = [];
    red_herrings = this.randomized_red_herrings(all_red_herrings);
    this.frames = [];
    transition = Math.floor(Math.random()*500) + 500;
    this.frames.push(new GiveawayAttemptView.Slot.Frame(
      index, transition, winner, "black", true
    ));
    transitions = [];
    red_herrings.each(function(rh) {
      transition = transition / 1.5;
      transitions.unshift(transition);
    })
    transition_sum = transitions.inject(
      0, function(acc, n) { return acc + n }
    );
    white_scales = [];
    sum = 0;
    transitions.each(function(t) {
      sum = sum + t;
      white_scales.push(255 - 32 - Math.floor(128 * sum / transition_sum));
    })
    while (red_herrings.length > 0) {
      white_scale = white_scales.pop();
      color = "rgb(" + white_scale + "," + white_scale + "," + white_scale + ")"
      this.frames.push(new GiveawayAttemptView.Slot.Frame(
        index, transitions.pop(), red_herrings.pop(), color, false
      ));
    }
    this.draw_next_frame();
  },
  
  draw_next_frame: function() {
    frame = this.frames.pop();
    frame.draw();
    this.last_frame = frame;
  },
  
  randomized_red_herrings: function(all_red_herrings) {
    red_herrings_count = Math.floor(Math.random()*5) + 50;
    if (red_herrings_count > all_red_herrings.size) {
      red_herrings_count = all_red_herrings.size;
    }
    red_herrings = []
    randomized = all_red_herrings.sortBy(function(s) { return Math.random() })
    while (red_herrings.length < red_herrings_count) {
      red_herrings.push(randomized.pop()['attendee']);
    }
    return red_herrings;
  },
  
  tick: function() {
    if (this.frames.length == 0) {
      this.done = true;
    } else if (this.frames.last().ready(this.last_frame)) {
      this.draw_next_frame();
    }
  }
}

GiveawayAttemptView.Slot.Frame = Class.create();
GiveawayAttemptView.Slot.Frame.prototype = {
  initialize: function(slot_index, transition, attendee, color, winner) {
    this.slot_index = slot_index;
    this.transition = transition;
    this.attendee = attendee;
    this.color = color;
    this.winner = winner;
  },
  
  draw: function() {
    $("slot_" + this.slot_index).innerHTML = this.attendee.name;
    $("slot_" + this.slot_index).style.color = this.color;
    this.draw_time = new Date().valueOf();
    if (this.winner) {
      new Effect.Highlight(
        "slot_" + this.slot_index,
        {startcolor: '#ffff99', restorecolor: 'true'}
      )
    }
  },
  
  ready: function(last_frame) {
    return ((new Date().valueOf()) - last_frame.draw_time >= this.transition);
  }
}

function close_giveaway(giveaway_id) {
  new Ajax.Request(
    '/giveaways/update/' + giveaway_id,
    {
      asynchronous:true,
      evalScripts:true,
      parameters:{"giveaway[active]":0},
      onSuccess: function(transport) {
        var giveaway = transport.responseText.evalJSON().giveaway;
        var giveaway_round = giveaway.giveaway_round;
        if (giveaway_round.active_giveaways > 0) {
          $('giveaway_option_' + giveaway.id).remove();
          $('giveaway_select').options[0].selected = true;
          load_giveaway_form();
        } else {
          $("giveaway_round_option_" + giveaway_round.id).remove();
          $('giveaway_round_select').options[0].selected = true;
          load_giveaway_round();
        }
      }
    }
  );
  $('newest_giveaway_attempt').hide();
};

function init() {
  new EJS(
    {url: "/frontends/goruco_2010/ejs/giveaway_rounds.ejs"}
  ).update(
    'giveaway_rounds', "/giveaway_rounds"
  );
  setTimeout("try_load_giveaway_round()", 25);
}

function load_giveaway_form() {
  var giveaway_id = $('giveaway_select').value;
  new EJS(
    {url: "/frontends/goruco_2010/ejs/giveaway.ejs"}
  ).update('giveaway_form', '/giveaways/show/' + giveaway_id + '.json');
}

function load_giveaway_round() {
  var giveaway_round_id = $('giveaway_round_select').value;
  if (giveaway_round_id) {
    $('giveaway_round').innerHTML = '';
    $('giveaway_form').innerHTML = '';
    var url = '/giveaway_rounds/show/' + giveaway_round_id + '.json';
    new EJS(
      {url: "/frontends/goruco_2010/ejs/giveaway_round.ejs"}
    ).update('giveaway_round', url);
  }
  setTimeout("try_load_giveaway_form()", 25);
};

function new_giveaway_attempt(giveaway_attempt) {
  $('newest_giveaway_attempt').show();
  $$('.giveaway_form').each(function(elt) { elt.disable();});
  setTimeout(
    "$$('.giveaway_form').each(function(elt) { elt.enable();});", 2000
  );
  new Ajax.Request(
    '/attendees/index/no_giveaway_attempt',
    {
      asynchronous:true,
      evalScripts:true,
      method:'get',
      onSuccess: function(transport) {
        red_herrings = transport.responseText.evalJSON();
        new GiveawayAttemptView(red_herrings, giveaway_attempt).animate();
      }
    }
  );
}

// Only works for UTC, which is fine because that's what we're returning by
// default
function parse_w3cdtf(time_str) {
  var matches = 
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z/(time_str);
  return new Date(
    Date.UTC(
      matches[1], matches[2]-1, matches[3], matches[4], matches[5], matches[6]
    )
  );
}

function try_load_giveaway_form() {
  if ($('giveaway_select')) {
    load_giveaway_form();
  } else {
    setTimeout("try_load_giveaway_form()", 25);
  }
}

function try_load_giveaway_round() {
  if ($('giveaway_round_select')) {
    load_giveaway_round();
  } else {
    setTimeout("try_load_giveaway_round()", 25);
  }
}
