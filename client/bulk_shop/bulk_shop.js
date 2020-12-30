var numberOfReferences = 0;
var referenceIDs = [];

$(document).ready(function(){
    viewBulkShop();
});

function viewBulkShop() {
    $("#bulk-container").append($("#view-bulk"));
    getReferences();
}

function getReferences() {

    $.ajax({
        url: '../user/bulk-shop',
        type: 'GET',
        async: true,
        success: function(references) {
            createReferences(references);
        }
    });
}

function createReferences(references) {
    numberOfReferences = references.length;

    for (var i = 0; i < references.length; i++) {
        var referenceID = references[i]["referenceID"];
        referenceIDs.push(referenceID);
        var picture = references[i]["picture"];

        $("#reference-image-row").append("<div class=\"image-column\" id=\"reference-image" + referenceID + "\">" +
            "<img src=\"" + picture + "\" style=\"width:100%\"></div>");
    }

    adminButton();

}

/*Client side validation for form data*/ 
function validateForm() {

    var name = document.getElementById('org-name').value;
    if (name == "") {
        document.querySelector('.status').innerHTML = "Du missade att ange föreningens namn";
        return false;
    }
    var subject = document.getElementById('person-name').value;
    if (subject == "") {
        document.querySelector('.status').innerHTML = "Du missade att ange ditt namn";
        return false;
    }
    var email = document.getElementById('contact-email').value;
    if (email == "") {
        document.querySelector('.status').innerHTML = "Du missade att ange en emailadress som vi kan nå er på";
        return false;
    } else {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            document.querySelector('.status').innerHTML = "Den emailadress du angav innehåller otillåtna tecken";
            return false;
        }
    }
    var message = document.getElementById('form-message').value;
    if (message == "") {
        document.querySelector('.status').innerHTML = "Du missade att ange ditt meddelande";
        return false;
    }

    document.querySelector('.status').innerHTML = "Skickar...";

    $.ajax({
        url: '/user/bulk-shop',
        type: 'PUT',
        datatype: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            "subject": document.getElementById("org-name").value,
            "name": document.getElementById("person-name").value,
            "email": document.getElementById("contact-email").value,
            "message": document.getElementById("form-message").value,
        })
    });
    
    viewMessageSent();
}

function viewMessageSent() {
    $("div.form-row").replaceWith("<h2>Tack för ditt meddelande, " + document.getElementById("person-name").value + "!</h2><br><h3>Vi återkommer så snart vi kan</h3><br><hr>")
}

function adminButton() {
    if (JSON.parse(sessionStorage.getItem('auth')) != null) {
        $("#admin-btn").append("<button class=\"btn btn-primary\" onclick=showModal()><p>Lägg till</p></button>");
        
        for (var i = 0; i < numberOfReferences; i++) {

            var referenceID = referenceIDs[i];
            $("#reference-image" + referenceID).append("<button class=\"btn btn-primary\" onclick=deleteReference(" + referenceID + ")><p>Delete</p></button>");

        }
    }
}



function showModal() {
    $('#add-modal').modal('show'); 
}

function addReference() {

    var pictureInput = "picture-input";

    var picture = (document.getElementById(pictureInput).value);
    picture = picture.replace("C:\\fakepath\\", "resources/images/");

    if (picture == "") {
        document.querySelector('.status').innerHTML = "Du missade att ange bilden";
        return false;
    } else {
        var output = JSON.stringify({"picture": picture});
    }
/*
    $.ajax({
        url: 'admin/bulk-shop/',
        type: 'POST',
        data: output,
        headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },

        success: function() {
            location.reload();         
        }
    });*/
}

function deleteReference(referenceID) {

    $.ajax({
        url: 'admin/bulk-shop/' + referenceID,
        type: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },

        success: function() {
            location.reload();
        }
    });
}

function submitAddReference() {

    var picture = (document.getElementById("picture-input-add-reference").value)
    picture = picture.replace("C:\\fakepath\\", "resources/images/");

    var output = JSON.stringify({"picture": picture});

    $.ajax({
        url: 'admin/bulk-shop',
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: output,
        headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },

        success: function() {
            location.reload();         
        }
    });
}
