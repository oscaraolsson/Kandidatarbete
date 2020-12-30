$(document).ready(function () {
  viewOrders();
});

function viewOrders() {
  
  $.ajax({
    url: '../order',
    type: 'GET',
    success(list) {
      for (i = 0; i < list.length; i++) {
        if (list[i].shipped == 1) {
          var prefix = "shipped";
        } else {
          var prefix = "new"
        }

        $("#" + prefix + "-grid").append(
          // "<div id ='date"+i+"' class='col'>Datum: </div>"+
          "<div id ='personalInfo' class='col'><hr><p class='small'>Datum: " + list[i].date + "</p><p class='small'>Namn: " + list[i].name + "</p><p class='small'> Mail: " + list[i].email + "</p><p class='small'> Tel:  " + list[i].phone + "</p></div>" +
          "<div id='addressInfo' class='col'><hr><p class='small'>Adress: " + list[i].address + "</p><p class='small'> Postkod:  " + list[i].ZIPcode + "</p><p class='small'> Stad: " + list[i].city + "</p><p class='small'> Lgh: " + list[i].apartmentnumber + "</p></div>" +
          "<div id='products" + i + "' ></div>");
        $("#date" + i).append(list[i].date);
        var str = list[i].product;
        n = str.length;
        y = 0;
        lablesList = ["Produkt ID: ", "Produkt: ", "Färg: ", "Storlek: ", "Pris: ", "antal: "];
        Q = 0;
        for (x = 0; x <= n; x++) {
          if (str.charAt(x) === ",") {
            if (x == 1) {
              $("#products" + i).append("<div class=col><hr><p class=small>" + lablesList[Q] + str.charAt(0) + "</p>");
              Q++;
              y = 2;
            } else {
              $("#products" + i).append("<div class=col><p class=small>" + lablesList[Q] + str.substr(y, x - y) + "</p>");
              Q++;
              y = x + 1;
            }
          }
          if (Q == 6) {
            $("#products" + i).append("<hr>");
            Q = 0;
          }
        }

        $('#products' + i).append("<div id='buttons" + i + "' class='col'>" +
          "<button class ='btn btn-primary' onclick=deleteOrder(" + list[i].ID + ")>Ta bort</button>" +
          "<button class ='btn btn-primary' onclick=editOrder(" + list[i].ID + ")>ändra</button></div>");
        $("#products" + i).append("<hr>");
        $('#grid').append("</div>");
        if (list[i].shipped == 0) {
          var int =1 
          $('#buttons' + i).append("<button class ='btn btn-primary' onclick=setShipped(" + list[i].ID+","+int+ ")>Skickad</button>");
        } else {
          var int =0
          $('#buttons' + i).append("<button class ='btn btn-primary' onclick=setShipped(" + list[i].ID+","+int+ ")>inte skickad</button>");
        }
        document.getElementById("name-input").value = list[i].name;
        document.getElementById("email-input").value = list[i].email;
        document.getElementById("phone-input").value = list[i].phone;
        document.getElementById("address-input").value = list[i].address;
        document.getElementById("city-input").value = list[i].city;
        document.getElementById("ZIPcode-input").value = list[i].ZIPcode;
        document.getElementById("apartmentnumber-input").value = list[i].apartmentnumber;
        document.getElementById("product-input").value = str;
      }
    }
  });

}

function setShipped(ID, int) {
  $.ajax({
    // headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
    url: 'admin/shipped/' + ID,
    type: 'PUT',
    datatype: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      "shipped": int,
    }),
    success: function () {
      window.location.href = "/orderHistory";
    }
  });
}

function deleteOrder(ID) {
  if (confirm("Är du säker på att du vill ta bort ordern?")) {
    reallyDeleteOrder(ID);
  }
  function reallyDeleteOrder(ID) {
    $.ajax({
      // headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
      url: '../order/' + ID,
      type: 'DELETE',
      success: function () {
        window.location.href = "/orderHistory";

      }
    });
  }
}

function editOrder(ID) {
  $('#edit-order').modal('show');
  document.getElementById("edit-modal-footer").innerHTML = "";
  $("#edit-modal-footer").append("<button type='button' class='btn btn-secondary' data-dismiss='modal'>Avbryt</button>" +
    "<button type='button' class='btn btn-secondary' onclick=submitEditOrder(" + ID + ") data-dismiss='modal'>Verkställ</button>"
  );
}

function submitEditOrder(ID) {
  $.ajax({
    //headers: { "Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token },
    url: '../order/'+ID,
    type: 'PUT',
    datatype: 'json',
    contentType: 'application/json',
    data: JSON.stringify({

      "name": document.getElementById("name-input").value,
      "email": document.getElementById("email-input").value,
      "phone": document.getElementById("phone-input").value,
      "address": document.getElementById("address-input").value,
      "city": document.getElementById("city-input").value,
      "ZIPcode": document.getElementById("ZIPcode-input").value,
      "apartmentnumber": document.getElementById("apartmentnumber-input").value,
      "product": document.getElementById("product-input").value
    }),
    success: function (data) {
      // hidemodal();
      window.location.href = "/orderHistory";
    }
  })
}