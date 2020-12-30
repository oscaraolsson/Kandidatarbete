
$(document).ready(function () {
    viewHome_page();
});


function viewHome_page() {
    getNews();
    getOpeningHours();
}

function getOpeningHours() {

    $.ajax({
        url: '../user/oppettider',
        type: 'GET',
        async: true,
        success: function (openinghours) {
            createOpeninghourscard(openinghours);
        }
    });
}


function getNews() {

    $.ajax({
        url: '../user/news',
        type: 'GET',
        async: true,
        success: function (news) {
            createCarusel(news);
        }
    });
}

function createCarusel(news) {
    numberOfNews = news.length;

    var newsIDs = [];

    for (var i = 0; i < numberOfNews; i++) {
        newsIDs.push(news[i].newsID);
    }

    var picture1 = news[0].picture;
    var picture2 = news[1].picture;
    var picture3 = news[2].picture;

    $("#Carouselpicture-item1").append("<a href='/nyheter'><img class=\"contain img-carousel\" src=" + picture1 + "></a>");
    $("#Carouselpicture-item2").append("<a href='/nyheter'><img class=\"contain img-carousel\" src=" + picture2 + "></a>");
    $("#Carouselpicture-item3").append("<a href='/nyheter'><img class=\"contain img-carousel\" src=" + picture3 + "></a>");
    $("#Carouseltext-item1").append("<h2 class=\"background\" id= \"carousel-header\">" + news[0].header + "</h2>" + "<p class=\"background\" id= \"carousel-text\">" + news[0].text + " <a href='/nyheter'>Läs mer</a></p>");
    $("#Carouseltext-item2").append("<h2 class=\"background\" id= \"carousel-header\">" + news[1].header + "</h2>" + "<p class=\"background\" id= \"carousel-text\">" + news[1].text + " <a href='/nyheter'>Läs mer</a></p>");
    $("#Carouseltext-item3").append("<h2 class=\"background\" id= \"carousel-header\">" + news[2].header + "</h2>" + "<p class=\"background\" id= \"carousel-text\">" + news[2].text + " <a href='/nyheter'>Läs mer</a></p>");

}


//////-------openinghours cards and admin functions-----------\\\\\\\
function createOpeninghourscard(openinghours) {
    numberOfOpeninghours = openinghours.length;


    var openinghoursIDs = [];

    for (var i = 0; i < numberOfOpeninghours; i++) {
        openinghoursIDs.push(openinghours[i]["ID"]);
    }


    for (var i = 0; i < numberOfOpeninghours; i++) {
        var openinghoursID = openinghours[i]["ID"];
        var openinghoursDay = openinghours[i]["day"];
        var openinghoursTime = openinghours[i]["time"];



        $('#Openinghours-container').append("<div id='hours" + openinghoursID+"'><p class=\"uppercase\" id= \"openinghours-text\">" + openinghoursDay + " - " + openinghoursTime +"</p></div>");

        if (JSON.parse(sessionStorage.getItem('auth')) != null) {
            $("#hours" + openinghoursID).append("<button type='submit' class='btn btn-primary' onclick=editHour(" + openinghoursID + ")> Ändra </button>");
            $("#hours" + openinghoursID).append("<button type='submit' class='btn btn-primary' onclick=deleteHour(" + openinghoursID + ")> Delete </button>");
        }    
    }
    if (JSON.parse(sessionStorage.getItem('auth')) != null) {
        $("#Openinghours-container").append("<button type='submit' class='btn btn-primary' onclick=addHour()>Lägg till special öppettid</button>");
    }
}

function editHour(ID) {
    document.getElementById("hours-modal-title").value = "Ändra öppettider för: ";
    document.getElementById("hours-modal-footer").innerHTML = "";
    $("#hours-modal-footer").append("<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Avbryt</button>");
    $("#hours-modal-footer").append("<button onclick=\"submitEditHours (" + ID + ")\" type=\"button\" class=\"btn btn-primary\">Ändra</button>");
    $('#hours-modal').modal('show');
}
function deleteHour(ID) {
    $.ajax({
        headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
        url: '/admin/oppettider/' + ID,
        type: 'DELETE',
        
    
        success: function () {
          window.location.href = "/hem";
          
        }
      });
}

function submitEditHours(ID) {
    $.ajax({
        headers: { "Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token },
        url: '/admin/oppettider/' + ID,
        type: 'PUT',
        datatype: 'json',
        contentType: 'application/json',
        data: JSON.stringify({

            "day": document.getElementById("day-input").value,
            "time": document.getElementById("time-input").value,
        }),
        success: function (data) {
            $('#hours-modal').modal('hide');
            window.location.href = "/hem";
        }
    })
}
function addHour(ID) {
    document.getElementById("hours-modal-title").value = "Lägg till öppettider ";
    document.getElementById("hours-modal-footer").innerHTML = "";
    $("#hours-modal-footer").append("<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Avbryt</button>");
    $("#hours-modal-footer").append("<button onclick=\"submitaddHours ()\" type=\"button\" class=\"btn btn-primary\">lägg till</button>");
    $('#hours-modal').modal('show');
}

function submitaddHours() {
    $.ajax({
        headers: { "Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token },
        url: '/admin/oppettider',
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json',
        data: JSON.stringify({

            "day": document.getElementById("day-input").value,
            "time": document.getElementById("time-input").value,
        }),
        success: function () {
            $('#hours-modal').modal('hide');
            window.location.href = "/hem";
        }
    })
}

function sendMessage() {

    var name = document.getElementById('flnamn').value;
    if (name == "") {
        document.querySelector('.status').innerHTML = "Du missade att ange namn";
        return false;
    }

    var ämne = document.getElementById('ämne').value;
    if (ämne == "") {
        document.querySelector('.status').innerHTML = "Du missade att ange ämne";
        return false;
    }

    var email = document.getElementById('email').value;
    if (email == "") {
        document.querySelector('.status').innerHTML = "Du missade att ange en Emailadress";
        return false;
    } else {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            document.querySelector('.status').innerHTML = "Emailadressen har inte korrekt form";
            return false;
        }
    }
    var message = document.getElementById('meddelande').value;
    if (message == "") {
        document.querySelector('.status').innerHTML = "Du missade att ange ditt meddelande";
        return false;
    }

    document.querySelector('.status').innerHTML = "Skickar...";

    $.ajax({
        url: 'user/kontakt',
        type: 'PUT',
        datatype: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            "name": document.getElementById("flnamn").value,
            "email": document.getElementById("email").value,
            "subject": document.getElementById("ämne").value,
            "message": document.getElementById("meddelande").value,
        })
    });
    viewMessageSent();
}

function viewMessageSent() {
    $("#form-card").replaceWith("<div id=\"form-card\"><h3>Tack för ditt meddelande, " + document.getElementById("flnamn").value + "! <br> Vi återkommer så snart vi kan.</h3><hr></div>")
}


$("#slideshow1 > div:gt(0)").hide();
$("#slideshow2 > div:gt(0)").hide();
setInterval(function() { 
  $('#slideshow1 > div:first')
  .hide()
  .next()
  .show()
  .end()
  .appendTo('#slideshow1');
},  3000); 
setInterval(function() { 
    $('#slideshow2 > div:first')
    .hide()
    .next()
    .show()
    .end()
    .appendTo('#slideshow2');
  },  3000); 

function takeMeToTheStore() {
    //$("#searchinput").val("Märken");
    searchFunction();
}