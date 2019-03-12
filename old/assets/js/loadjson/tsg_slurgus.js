$(function() {
  var aliases = [];
  $.getJSON('tsg_slurgus.json', function(data) {
    $.each(data.aliases, function(i, f) {
      var tblRow = "<tr>" + "<td>" + f.name + "</td>" + "<td>" + f.created_at + "</td>" + "</tr>"
      $(tblRow).appendTo("#tsg_slurgus tbody");
    });
  });
});
