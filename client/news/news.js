var numberOfNews;

function getNews() {

    $.ajax({
        url: '../user/news',
        type: 'GET',
        async: true,
        success: function(news) {
            createNewsCards(news);
        }
    });
}

function submitPost(newsID) {

    var headerInputFieldID = "header-input" + newsID;
    var textInputFieldID = "text-input" + newsID;

    var pictureInputFieldID = "picture-input" + newsID;

    var picture = (document.getElementById(pictureInputFieldID).value)
    picture = picture.replace("C:\\fakepath\\", "resources/images/");

    if (picture == "") {
        var output = JSON.stringify({"header": document.getElementById(headerInputFieldID).value, "text": document.getElementById(textInputFieldID).value});
    } else {
        var output = JSON.stringify({"header": document.getElementById(headerInputFieldID).value, "text": document.getElementById(textInputFieldID).value, "picture": picture});
    }

    $.ajax({
        url: 'admin/news/' + newsID,
        type: 'PUT',
        data: output,
        headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },

        success: function() {
            location.reload();         
        }
    });
}

function deletePost(newsID) {

    $.ajax({
        url: 'admin/news/' + newsID,
        type: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },

        success: function() {
            location.reload();         
        }
    });
}

function addArticle() {
    $('#add-modal').modal('show'); 
}

function editNews(...newsIDs) {

    var addButton = document.getElementById("add-article-button");

    var editMode = addButton.style.display == "none";

    if (editMode) {
        $(addButton.style.display = "block");
        alert("Du kan nu redigera enskilda artiklar genom att trycka på \"Läs mer\" för respektive artikel");
    } else {
        $(addButton.style.display = "none");
    }

    for (var i = 0; i < numberOfNews; i++) {

        newsID = newsIDs[i];

        var submitButtonID = "submit-button" + newsID;
        var submitButton = document.getElementById(submitButtonID);
        var deleteButtonID = "delete-button" + newsID;
        var deleteButton = document.getElementById(deleteButtonID);
        var headerID = "modal-title" + newsID;
        var headerInputID = "header-input" + newsID;
        var header = document.getElementById(headerID);
        var headerInput = document.getElementById(headerInputID);
        var textID = "modal-text" + newsID;
        var textInputID = "text-input" + newsID;
        var textDiv = document.getElementById(textID);
        var textInput = document.getElementById(textInputID);
        var pictureID = "modal-picture" + newsID;
        var pictureInputID = "picture-input" + newsID;
        var picture = document.getElementById(pictureID);
        var pictureInput = document.getElementById(pictureInputID);

        var headerText = encodeURIComponent(header.textContent);
        var text = encodeURIComponent(textDiv.textContent);

        if (editMode) {
            $(submitButton.style.display = "block");
            $(deleteButton.style.display = "block");
            $(header.style.display = "none");
            $(headerInput.style.display = "block");
            $(textDiv.style.display = "none");
            $(textInput.style.display = "block");
            $(picture.style.display = "none");
            $(pictureInput.style.display = "block");
        } else {
            $(submitButton.style.display = "none");
            $(deleteButton.style.display = "none");
            $(header.style.display = "block");
            $(headerInput.style.display = "none");
            $(textDiv.style.display = "block");
            $(textInput.style.display = "none");
            $(picture.style.display = "block");
            $(pictureInput.style.display = "none");   
        }

        $("#" + headerInputID).val(decodeURIComponent(headerText));
        $("#" + textInputID).val(decodeURIComponent(text));

    } 

}

function toPost(newsID) {
    $('#newsmodal' + newsID).modal('show'); 
}

function submitAdd() {

    var picture = (document.getElementById("picture-input-add").value)
    picture = picture.replace("C:\\fakepath\\", "resources/images/");

    if (picture == "") {
        picture = "resources/images/placeholder.png";
    }

    var date = (document.getElementById("date-input-add").value).toString();

    if (date == "") {
        date = new Date().toJSON().slice(0, 10);
    }

    var output = JSON.stringify({"header": document.getElementById("header-input-add").value, 
    "text": document.getElementById("text-input-add").value,
    "date": date, 
    "picture": picture
});

    $.ajax({
        url: 'admin/news',
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: output,
        headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },

        success: function() {
            location.reload();         
        }
    });

}

function shareArticle(newsID) {
    var header = document.getElementById("header" + newsID);
    var headerText = encodeURIComponent(header.textContent);
    var textDiv = document.getElementById("card-text" + newsID);
    var text = encodeURIComponent(textDiv.textContent);

    $('#share-modal-body').append("<a class=\"btn btn-primary\" href=\"http://twitter.com/intent/tweet?text=" + decodeURIComponent(headerText) + ". Läs mer på liustore.se/nyheter\" onclick=\"window.open(this.href, 'twitterwindow','left=20,top=20,width=600,height=300,toolbar=0,resizable=1'); return false;\"><p>Dela den här nyheten på Twitter</p></a>");
    $('#share-modal').modal('show'); 
}

function emptyShareModal() {
    document.getElementById("share-modal-body").innerHTML = "";
}

function createNewsCards(news) {
    numberOfNews = news.length;

    var newsIDs = [];

    for (var i = 0; i < numberOfNews; i++) {
        newsIDs.push(news[i]["newsID"]);
    }

    //Admin-button

    if (JSON.parse(sessionStorage.getItem('auth')) != null) { 
        $("#admin-button-container").append("<button onclick=editNews(" + newsIDs + ")><p class=\"admin-button-text\">Redigera</p></button>");
    }

    $("#admin-button-container").append("<button id=\"add-article-button\" style=\"display: none\" onclick=addArticle()><p class=\"admin-button-text\">Ny artikel</p></button>");

    for (var i = 0; i < numberOfNews; i++) {
        var newsID = news[i]["newsID"];
        var header = news[i]["header"];
        var text = news[i]["text"];
        var picture = news[i]["picture"];
        var date = news[i]["date"];

        //Cards

        $("#card-columns").append("<div class=\"card\" id=\"general-card\">" + 
        "<img id=\"card-img" + newsID + "\" class=\"news-card-img\" src=" + picture + ">" + 
        "<div class=\"card-body\">" +
            "<h3 id=\"header" + newsID + "\" class=\"card-title\">" + header + "</h3>" +
            "<div class=\"date-area\">" + 
                "<img class=\"clock-icon\" src=\"resources/images/clock.png\">" + 
                "<p class=\"date\">" + date + "</p>" + 
            "</div>" + 
            "<p id=\"card-text" + newsID + "\" class=\"card-text\">" + text + "</p>" +
            "<div class=\"card-footer\">" + 
                "<p onclick=toPost(" + newsID + ") class=\"link-text\">Läs mer</p>" + 
                    "<img onclick=\"shareArticle(" + newsID + ")\" class=\"share-icon\" src=\"resources/images/share-icon.png\">" + 
            "<div>" + 
        "</div>" + 
    "</div>");

        //Article modals

        $("#news-main").append(
        "<div class=\"modal\" tabindex=\"-1\" role=\"dialog\" id=\"newsmodal" + newsID + "\">" +
        "<div class=\"modal-dialog\" role=\"document\">" +
        "<div class=\"modal-content\">" +
            "<img class=\"modal-picture no-padding\" id=\"modal-picture" + newsID + "\" src=" + picture + ">" + 
            "<div class=\"modal-header\">" +
            "<input class=\"form-control\" type=\"text\" id=\"header-input" + newsID + "\"></input>" + 
            "<h2 id=\"modal-title" + newsID + "\" class=\"news-header-minor\">" + header + "</h2>" +
            "</div>" +
            "<div class=\"modal-body\">" +
            "<input class=\"form-control\" type=\"file\" id=\"picture-input" + newsID + "\" style=\"display:none\"></input>" + 
            "<div id=\"modal-text-container\"" + newsID + ">" + 
                "<input class=\"form-control\" type=\"text\" id=\"text-input" + newsID + "\" placeholder=" + text + "></input>" + 
                "<div class=\"modal-text-field\" id=\"modal-text" + newsID + "\"><p class=\"modal-text\">" + text + "</p></div>" + 
            "</div>" +      
            "</div>" +
            "<div class=\"modal-footer\">" +
            "<div class=\"date-area\">" +
                "<img class=\"clock-icon\" src=\"resources/images/clock.png\">" + 
                "<p class=\"date\">" + date + "</p>" + 
            "</div>" + 
            "<div class=\"edit-button-container\">" + 
            "<button id=\"submit-button" + newsID + "\" class=\"submit-button\" onclick=submitPost(" + newsID + ")>Verkställ</button>" + 
            "<button id=\"delete-button" + newsID + "\" class=\"delete-button\" onclick=deletePost(" + newsID + ")>Radera</button>" + 
            "</div>" + 
            "<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Stäng</button>" +
            "</div>" +
        "</div>" +
        "</div>" +
    "</div>");


    }
}
