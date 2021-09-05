// method preset
function winorlose() {
  var winorlose;

  var a = document.getElementById("mmr").value;
  var b = document.getElementById("elo").value;
  var c = document.getElementById("goal").value;
  var d = ((c - a) / b);
  var e = Math.ceil(d);

  if (e > 0) {
      winorlose = "You need to <b>win</b> ";
  } else if (e < 0) {
      winorlose = "You need to <b>lose</b> ";
  } else {
      winorlose = "You <b>do not</b> need to win or lose ";
  }
  document.getElementById("winorlose").innerHTML = winorlose;
}
(function() {
  function calculateRankGoal(mmr, elo, goal) {
      mmr = parseFloat(mmr);
      elo = parseFloat(elo);
      goal = parseFloat(goal);

      var a = ((goal - mmr) / elo);
      var b = Math.ceil(a);
      var c = Math.abs(b);
      return c;
  }

  var preset = document.getElementById("preset");
  if (preset) {
      preset.onsubmit = function() {
          document.getElementById("result").innerHTML = calculateRankGoal(this.mmr.value, this.elo.value, this.goal.value);
          return false;
      };
  }
}());
function matchcount() {
  var matchcount;

  var a = document.getElementById("mmr").value;
  var b = document.getElementById("elo").value;
  var c = document.getElementById("goal").value;
  var d = ((c - a) / b);
  var e = Math.ceil(d);
  var f = Math.abs(e);

  if (f == 1) {
      matchcount = " (&plusmn 1) match to reach your rank goal";
  } else if (f > 1) {
      matchcount = " (&plusmn 1) matches to reach your rank goal";
  } else {
      matchcount = " matches to reach your rank goal";
  }
document.getElementById("matchcount").innerHTML = matchcount;
}
function dontwinorlose() {
var a = document.getElementById("winorlose").innerHTML;

if (a == "You <b>do not</b> need to win or lose ") {
  document.getElementById("result").style.display = "none";
  document.getElementById("anydiv").innerHTML = "<b>any</b>";
} else {
  document.getElementById("result").style.display = "";
  document.getElementById("anydiv").innerHTML = "";
}
}

// method custom
function winorlose1() {
  var winorlose;

  var a = document.getElementById("mmr1").value;
  var b = document.getElementById("elo1").value;
  var c = document.getElementById("goal1").value;
  var d = ((c - a) / b);
  var e = Math.ceil(d);

  if (e > 0) {
      winorlose = "You need to <b>win</b> ";
  } else if (e < 0) {
      winorlose = "You need to <b>lose</b> ";
  } else {
      winorlose = "You <b>do not</b> need to win or lose ";
  }
  document.getElementById("winorlose1").innerHTML = winorlose;
}
(function() {
  function calculateRankGoal1(mmr1, elo1, goal1) {
      mmr1 = parseFloat(mmr1);
      elo1 = parseFloat(elo1);
      goal1 = parseFloat(goal1);

      var a = ((goal1 - mmr1) / elo1);
      var b = Math.ceil(a);
      var c = Math.abs(b);
      return c;
  }

  var custom = document.getElementById("custom");
  if (custom) {
      custom.onsubmit = function() {
          document.getElementById("result1").innerHTML = calculateRankGoal1(this.mmr1.value, this.elo1.value, this.goal1.value);
          return false;
      };
  }
}());
function matchcount1() {
  var matchcount;

  var a = document.getElementById("mmr1").value;
  var b = document.getElementById("elo1").value;
  var c = document.getElementById("goal1").value;
  var d = ((c - a) / b);
  var e = Math.ceil(d);
  var f = Math.abs(e);

  if (f == 1) {
      matchcount = " (&plusmn 1) match to reach your rank goal";
  } else if (f > 1) {
      matchcount = " (&plusmn 1) matches to reach your rank goal";
  } else {
      matchcount = " matches to reach your rank goal";
  }
  document.getElementById("matchcount1").innerHTML = matchcount;
}

function dontwinorlose1() {
var a = document.getElementById("winorlose1").innerHTML;

if (a == "You <b>do not</b> need to win or lose ") {
  document.getElementById("result1").style.display = "none";
  document.getElementById("anydiv1").innerHTML = "<b>any</b>";
} else {
  document.getElementById("result1").style.display = "";
  document.getElementById("anydiv1").innerHTML = "";
}
}

//the preset() and custom() functions provide method switch functionality
function preset() {
  document.getElementById("preset").style.display = "block";
  document.getElementById("custom").style.display = "none";
  document.getElementById('presetbtn').disabled = true;
  document.getElementById('custombtn').disabled = false;
}

function custom() {
  document.getElementById("preset").style.display = "none";
  document.getElementById("custom").style.display = "block";
  document.getElementById('presetbtn').disabled = false;
  document.getElementById('custombtn').disabled = true;
}

function enable() {
  document.getElementById("display").style.display = "";
  document.getElementById("errordialogue").style.display = "";
}

function disable() {
  document.getElementById("display").style.display = "none";
  document.getElementById("errordialogue").style.display = "none";
}

function enable1() {
  document.getElementById("display1").style.display = "";
  document.getElementById("errordialogue1").style.display = "";
}

function disable1() {
  document.getElementById("display1").style.display = "none";
  document.getElementById("errordialogue1").style.display = "none";
}

function presetreset() {
  document.getElementById("preset").reset();
}

function customreset() {
  document.getElementById("custom").reset();
}

function r6rcpage() {
  if (document.getElementById('r6rcpage').style.display = "none") {
    document.getElementById('r6rcpage').style.display = "block";
    document.getElementById('playersearchpage').style.display = "none";
    document.getElementById('contributorspage').style.display = "none";
    document.getElementById('changelogpage').style.display = "none";
  }
}

function changelogpage() {
  if (document.getElementById('changelogpage').style.display = "none") {
    document.getElementById('r6rcpage').style.display = "none";
    document.getElementById('playersearchpage').style.display = "none";
    document.getElementById('contributorspage').style.display = "none";
    document.getElementById('changelogpage').style.display = "block";
  }
}

function playersearchpage() {
  if (document.getElementById('playersearchpage').style.display = "none") {
    document.getElementById('r6rcpage').style.display = "none";
    document.getElementById('playersearchpage').style.display = "block";
    document.getElementById('contributorspage').style.display = "none";
    document.getElementById('changelogpage').style.display = "none";
  }
}

function contributorspage() {
  if (document.getElementById('contributorspage').style.display = "none") {
    document.getElementById('r6rcpage').style.display = "none";
    document.getElementById('playersearchpage').style.display = "none";
    document.getElementById('contributorspage').style.display = "block";
    document.getElementById('changelogpage').style.display = "none";
  }
}
window.addEventListener("keydown", checkKeyPressed, false);
var fullscreenmessage = false;

function checkKeyPressed(e) {
  if (e.keyCode == 122) {
    document.getElementById('exitfullscreenmessage').style.display = fullscreenmessage ? "none" : "block";
    fullscreenmessage = !fullscreenmessage;
  }
}

//preset method
function checkmmrfill() {
  var finalmessage;
  x = document.getElementById("mmr").value;
  if (x < 1100) {
    document.getElementById("display").style.display = "none";
    document.getElementById("mmrerrormessage").style.display = "";
    finalmessage = "Enter player MMR";
  } else if (x > 10000) {
    document.getElementById("display").style.display = "none";
    document.getElementById("mmrerrormessage").style.display = "";
    finalmessage = "Enter a valid MMR";
  } else {
    document.getElementById("mmrerrormessage").style.display = "none";
    finalmessage = "MMR: OK";
  }
  document.getElementById("mmrerrormessage").innerHTML = finalmessage;
}

function checkelofill() {
  var finalmessage;
  x = document.getElementById("elo").value;
  if (x < 1) {
    document.getElementById("display").style.display = "none";
    document.getElementById("eloerrormessage").style.display = "";
    finalmessage = "Enter player ELO";
  } else if (x > 500) {
    document.getElementById("display").style.display = "none";
    document.getElementById("eloerrormessage").style.display = "";
    finalmessage = "Enter a valid ELO";
  } else {
    document.getElementById("eloerrormessage").style.display = "none";
    finalmessage = "ELO: OK";
  }
  document.getElementById("eloerrormessage").innerHTML = finalmessage;
}

function checkgoalfill() {
  var finalmessage;
  x = document.getElementById("goal").value;
  if (x == "") {
    document.getElementById("display").style.display = "none";
    document.getElementById("goalerrormessage").style.display = "";
    finalmessage = "Select a rank from the dialogue above.";
  } else {
    document.getElementById("goalerrormessage").style.display = "none";
    finalmessage = "GOAL: OK";
  }
  document.getElementById("goalerrormessage").innerHTML = finalmessage;
}
//custom method
function checkmmrfill1() {
  var finalmessage;
  x = document.getElementById("mmr1").value;
  if (x < 1100) {
    document.getElementById("display1").style.display = "none";
    document.getElementById("mmrerrormessage1").style.display = "";
    finalmessage = "Enter player MMR";
  } else if (x > 10000) {
    document.getElementById("display1").style.display = "none";
    document.getElementById("mmrerrormessage1").style.display = "";
    finalmessage = "Enter a valid MMR";
  } else {
    document.getElementById("mmrerrormessage1").style.display = "none";
    finalmessage = "MMR: OK";
  }
  document.getElementById("mmrerrormessage1").innerHTML = finalmessage;
}

function checkelofill1() {
  var finalmessage;
  x = document.getElementById("elo1").value;
  if (x < 1) {
    document.getElementById("display1").style.display = "none";
    document.getElementById("eloerrormessage1").style.display = "";
    finalmessage = "Enter player ELO";
  } else if (x > 500) {
    document.getElementById("display1").style.display = "none";
    document.getElementById("eloerrormessage1").style.display = "";
    finalmessage = "Enter a valid ELO";
  } else {
    document.getElementById("eloerrormessage1").style.display = "none";
    finalmessage = "ELO: OK";
  }
  document.getElementById("eloerrormessage1").innerHTML = finalmessage;
}

function checkgoalfill1() {
  var finalmessage;
  x = document.getElementById("goal1").value;
  if (x < 1100) {
    document.getElementById("display1").style.display = "none";
    document.getElementById("goalerrormessage1").style.display = "";
    finalmessage = "Select a rank from the dialogue above.";
  } else if (x > 10000) {
    document.getElementById("display1").style.display = "none";
    document.getElementById("goalerrormessage1").style.display = "";
    finalmessage = "Enter a valid Goal";
  } else {
    document.getElementById("goalerrormessage1").style.display = "none";
    finalmessage = "GOAL: OK";
  }
  document.getElementById("goalerrormessage1").innerHTML = finalmessage;
}