google.load('visualization', 1.0);

var eventName = "Template"
var database = "https://docs.google.com/a/wethersfield.me/spreadsheets/d/1NcGy2e_nzsDuX-BkHcw0UlzSTdIkbnn0ONIN6stE9Ag/edit";
var formInfo = {
  "link": "https://docs.google.com/a/wethersfield.me/forms/d/1vbIiF_vxU-7NlFoiUFQRehvvhNWZoMfOBdqPuDl54G0/formResponse",
  "timeIn": "entry.1826631571",
  "sid": "entry.846193839", 
  "firstName": "entry.1810641923", 
  "lastName":"entry.2112623826", 
  "grade": "entry.421600000",
  "team": "entry.1105692196"
}

$( document ).ready(function() {
  $("#title").html(eventName);
  $("#sid").keyup(function (e) {
    if (e.keyCode === 13) {
       getStudent();
    }
  });

});

function getStudent(){

  var id = $("#sid").val();
  console.log(id);

  if(typeof id == 'string') {
    if(id.charAt(0) == 'P') id = id.substring(1);
  }

  var opts = {sendMethod: 'auto'};
  var query = new google.visualization.Query(database, opts);
  query.setQuery('select * where A =' + id);
  query.send(handleQueryResponse);
  console.log('sent');
}

function handleQueryResponse(response){
  if(response.isError()){
    console.log('Error: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }
  var data = response.getDataTable();
  if(data.getNumberOfRows() > 1) {
    alert("Please ask a teacher for help.");
    $("#sid").val('');
    return;
  }else if(data.getNumberOfRows() < 1){
    alert("Did you type your ID in correctly?");
    $("#sid").val('');
    return;
  }

  var student = {
      sid: data.getValue(0,0),
      firstName: data.getValue(0,1),
      lastName: data.getValue(0,2),
      grade: data.getValue(0,3),
      team: data.getValue(0,4)
  }

  $("#sid").val("");

  postToGoogle(student);
}

function postToGoogle(student) {
  var form = document.createElement("form");

  form.action = formInfo.link;
  form.method = "POST";
  form.id="ss-form";
  form.target = "my_iframe";
  var timeIn = new Date();

  form.innerHTML = [
    "<input id='entry_1826631571' name = '" + formInfo.timeIn + "'' value = '" + timeIn + "'/>",
    "<input id='entry_846193839' name = '" + formInfo.sid + "' value = '" + student.sid + "'/>",
    "<input id='entry_1810641923' name = '" + formInfo.firstName + "' value = '" + student.firstName + "'/>",
    "<input id='entry_2112623826' name = '" + formInfo.lastName + "' value = '" + student.lastName + "'/>",
    "<input id='entry_421600000' name = '" + formInfo.grade + "' value = '" + student.grade + "'/>",
    "<input id='entry_1105692196' name = '" + formInfo.team + "' value = '" + student.team + "'/>"
  ].join("");

  form.submit();
  addToPage(student);
}

function addToPage(student){
  $("#student").attr("data-sid", student.sid);
  $("#student #first-name").html(student.firstName);
  $("#student #last-name").html(student.lastName);
  $("#student #grade").html(student.grade);
  $("#student #team").html(student.team);
  setTimeout(removeFromPage, 8000);
}

function removeFromPage(){
  $("#student").attr("data-sid", 0);
  $("#student #first-name").html("");
  $("#student #last-name").html("");
  $("#student #grade").html("");
  $("#student #team").html("");
}