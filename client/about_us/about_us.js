
$(document).ready(function () {
  viewaboutus();
});

function viewaboutus() {
  $.ajax({
    url: 'user/omoss',
    type: 'GET',
    success(list) {
      omoss = list[0];
      $('#aboutus-picture').append("<img src=" + omoss.picture + " class = img-fluid id = aboutus_img   >");
      
      $('#svenska').append("<p class=\"large\" id=\"aboutus-text\">" + omoss.text + "</p>");
      $('#english').append("<p class=\"large\" id=\"aboutus-text\">" + omoss.english + "</p>");
      //appends text to modal for change:
      document.getElementById("aboutus-swe-text").value = omoss.text;
      document.getElementById("aboutus-eng-text").value = omoss.english;


      if (JSON.parse(sessionStorage.getItem('auth')) != null) {
      $('#aboutus-main').append("<button type='submit' class='btn btn-primary' data-toggle='modal' data-target='#editAboutus'  id='editButton' > Ändra omoss texterna, både den engelska och svenska </button>");
      }
      //appends coworkercards
      for (var i = 1; i < list.length; i++) {
        $("#card-columns").append("<div id='general-card' class ='card'>" +
          "<img id=”card-img"+list[i].coworkerID+" class='news-card-img' src="+ list[i].picture + ">" +
          "<div class = 'card-body' id='card-text-container"+list[i].coworkerID +"'>" +
          "<h3 id=\"coworker-header" + list[i].coworkerID + "\" class=\"card-title\">" + list[i].header + "</h3>" +
          "<div class=\"coworker-text\">" + 
          "<p id = \"coworker-text"  + list[i].coworkerID + "\">" + list[i].text + "</p>" +
          "</div></div></div>"
        );
        console.log("id=card-footer"+list[i].coworkerID);
        if (JSON.parse(sessionStorage.getItem('auth')) != null) {
        $("#card-text-container"+list[i].coworkerID).append("<div class='card-footer' id='card-footer"+list[i].coworkerID +"'></div>");
        $("#card-footer" + list[i].coworkerID).append("<button type='submit' class='btn btn-primary' onclick=editCoworker(" + list[i].coworkerID + ")  id=" + list[i].coworkerID +"> Ändra </button>");
        $("#card-footer" + list[i].coworkerID).append("<button type='submit' class='btn btn-primary' onclick=deleteCoworker(" + list[i].coworkerID + ")  id=" + list[i].coworkerID + "> Delete </button>");
        }
      }
      if (JSON.parse(sessionStorage.getItem('auth')) != null) {
        $("#news-container").append("<button type='submit' class='btn btn-primary' data-toggle='modal' data-target='#new-coworker'> Lägg till medarbetare </button>");
      }
    }
  });
}

function submitAboutusChange() {
  $.ajax({
    headers:{ "Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token},
    url: 'admin/omoss',
    type: 'PUT',
    datatype: 'json',
    contentType: 'application/json',
    data: JSON.stringify({

      "text": document.getElementById("aboutus-swe-text").value,
      "english": document.getElementById("aboutus-eng-text").value,
    }),
    success: function (data) {
      hidemodal();
      window.location.href = "/omoss";
    }
  })
}
function hidemodal() {
  $('#editAboutus').modal('hide')
}

function deleteCoworker(ID) {
  $.ajax({
    headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
    url: 'admin/coworkers/' + ID,
    type: 'DELETE',
    

    success: function () {
      window.location.href = "/omoss";
      
    }
  });
}

function editCoworker(ID) {
  $('#edit-coworker').modal('show');
  document.getElementById("edit-modal-footer").innerHTML = "";
  $("#edit-modal-footer").append("<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Avbryt</button>");
  $("#edit-modal-footer").append("<button onclick=\"submitEditCoworker("+ID+")\" type=\"button\" class=\"btn btn-primary\">Ändra</button>");
  document.getElementById("header-input").value = document.getElementById("coworker-header"+ID).innerHTML;
  document.getElementById("text-input").value = document.getElementById("coworker-text"+ID).innerHTML;
}


function submitEditCoworker(ID) {
  var picture = (document.getElementById("picture-input-edit").value)
  picture = picture.replace("C:\\fakepath\\", "resources/images/");
  
  if (picture == "") {
    $.ajax({
      headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
      url: 'admin/coworkers/' + ID,
      type: 'PUT',
      datatype: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        "text": document.getElementById("text-input").value,
        "header": document.getElementById("header-input").value,
        "picture":""
      }),
      success: function () {
        $('#edit-coworker').modal('hide')
        window.location.href = "/omoss";
      }
    });
  } else {
    $.ajax({
      headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
      url: 'admin/coworkers/' + ID,
      type: 'PUT',
      datatype: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        "text": document.getElementById("text-input").value,
        "header": document.getElementById("header-input").value,
        "picture": picture
      }),
      success: function () {
        $('#edit-coworker').modal('hide')
        window.location.href = "/omoss";
      }
    });  } 
}

function newCoworker() {
  var picture = (document.getElementById("picture-input-add").value)
  picture = picture.replace("C:\\fakepath\\", "resources/images/");
  
  $.ajax({
    headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
    url: 'admin/coworkers',
    type: 'POST',
    datatype: 'json',
    contentType: 'application/json',
    data: JSON.stringify({

      "text": document.getElementById("new-text-input").value,
      "header": document.getElementById("new-header-input").value,
      "picture": picture
    }),
    success: function () {
      $('#new-coworker').modal('hide')
      window.location.href = "/omoss";
    }
  });

}



