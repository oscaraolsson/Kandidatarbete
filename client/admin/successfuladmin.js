function reload(tab) {
  console.log("kör reload")
  window.location.hash = tab;
  window.location.reload();
}



function tab(tabname) {
  console.log("'"+tabname+"'");
  window.location.hash = tabname;
    var all = $(".tabcontent");
    for(i=0;i<all.length;i++) {
        if(all[i].id == tabname) {
            $("#"+all[i].id).show();
            if(tabname == "orderstab") {
              viewOrders();
              console.log("hej");
            }
            else if(tabname == "stocktab") {
              viewStock();
            }
            $("#tabbutton"+String(i+1)).css({ 'background-color': '#D3D3D3'});
        }
        else{
            $("#"+all[i].id).hide();
            $("#tabbutton"+String(i+1)).css({ 'background-color': '#FFFFFF'});
        }
    }
}
$( document ).ready(function() {
  var chosentab = window.location.hash.substring(1, window.location.hash.length);
  if (chosentab != "") {
    console.log("kör tab");
    tab(chosentab);
  }
  else {
    console.log("kör inte tab");
    var all = $(".tabcontent");
    $("#tabbutton"+1).css({ 'background-color': '#D3D3D3'});
    for(i=1;i<all.length;i++) {
        
        console.log(i);
        $("#"+all[i].id).hide();
        $("#tabbutton"+String(i+1)).css({ 'background-color': '#FFFFFF'});
    }
    viewStock();
  }      
});

function createproducttype() {
    
    var data = $("#createproducttypeform").serializeArray();
    console.log(data);
    console.log(data[4]['value'].split(',').length);
    console.log(data[5]['value'].split(',').length);
    console.log(data[6]['value'].split(',').length);
    if(data[4]['value'].split(',').length == data[5]['value'].split(',').length  &&  data[4]['value'].split(',').length == data[6]['value'].split(',').length) {
        
        var postproducttype = {"name": data[0]['value'],
        "description": data[1]['value'],
        "price": data[2]['value'],
        "categories": data[3]['value'].split(','),
        "colors": data[4]['value'].split(','),
        "colornames": data[5]['value'].split(','),
        "pictures": data[6]['value'].split(','),
        "sizes": data[7]['value'].split(','),
        "canOrder": (data.length>8)};

        $.ajax({
            url: '/admin/webshop',
            type: 'POST',
            data: JSON.stringify(postproducttype),
            datatype: 'JSON',
            contentType: 'application/json',
            headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
            success: function(e) {
                alert("produkt tillagd!");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("Något gick fel när du lade till produkten. Kanske finns redan en produkt med samma namn i databasen? Se konsolen (tryck f12) för att se felet");
                console.log("Status: " + textStatus + " Error: " + errorThrown);
                console.log(XMLHttpRequest);
            }
        });
    }
    else {
      alert("Fel format på indata! Obs att #färger=#hexkoder=#bilder");
    }
}

function fillrolldownwithproducts() {
    $.ajax({
        url: '/products',
        type: 'GET',
        success: function(data) {
          $("#ptlistdelete").html("");
            for(i=0; i<data.length;i++) {
                $("#ptlistdelete").append("<option value="+data[i].ID+">"+data[i].name+"</option>")
            }
        }
    });
}


function deleteselectedproduct() {
    if (confirm("Säkert att du vill radera produkten?")) {
        var producttodelete = $("#ptlistdelete").val();
        $.ajax({
            url: '/admin/webshop/' + producttodelete,
            headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
            type: 'DELETE',
            success: function(data) {
                alert("Produkten raderades från databasen!");
            }
        });
    }
}
function editselectedproduct() {
    
    if (confirm("Säkert att du vill redigera produkten?")) {
        var newdata = window.prompt("Ange det nya värdet:","");
        var dicttoreturn = {};
        dicttoreturn[$("#ptlistedit").val()] = newdata;
        var producttoedit = $("#ptlistdelete").val();
        $.ajax({
            url: '/admin/webshop/' + producttoedit,
            headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
            data: JSON.stringify(dicttoreturn),
            type: 'PUT',
            success: function(data) {
                alert("Produkten har redigerats");
            }
        });
    }
}  
  function viewStock() {
    $.ajax({
      headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
      url: '/admin/lager',
      type: 'GET',
      success(list) {
        list.sort();
        $("#stock-modal-footer").empty();
        $("#stock-main").empty();
        for (var i = 0; i < list.length; i++) {
          $("#stock-main").append("<hr> <div class=\"row\">" +
            "<div class=\"col\"><H1>" + list[i].productType + "</H1></div>" +
            "<div class=\"col\"><H1>" + list[i].color + "</H1></div>" +
            "<div class=\"col\"><H1>" + list[i].size + "</H1></div>" +
            "<div class=\"col\"><H1 id=\"stock-text"+list[i].ID+"\">" + list[i].inStock + "</H1></div>" +
            "<button type='submit' class='btn btn-primary' onclick=editStock(" + list[i].ID + ")  id=" + list[i].ID + "> ändra </button>" +
            "</div>"
          );
          
        }
        
      }
    });
    // $("#stock-modal-footer").append("<button id='modaleditbutton' type=\"button\" class=\"btn btn-primary\">Ändra</button>");
  }
  
  function editStock(ID) {
    $('#admin-edit-stock-modal').modal('show');
    document.getElementById("stock-modal-footer").innerHTML = "";
    document.getElementById("stock-input").value = document.getElementById("stock-text"+ID).innerHTML;
    // document.getElementById('modaleditbutton').setAttribute('onclick',"submitStockChange("+ID+")");
    $("#stock-modal-footer").append("<button type='button' class='btn btn-secondary' data-dismiss='modal'>Avbryt</button>"+
    "<button Onclick=\"submitStockChange("+ID+")\" type=\"button\" class=\"btn btn-primary\">Ändra</button>");
    
  }
  function submitStockChange(ID) {
    $.ajax({
      headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
      url: '/admin/lager/' + ID,
      type: 'PUT',
      datatype: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        "inStock": document.getElementById("stock-input").value,
      }),
      success: function () {
        $('#admin-edit-stock-modal').modal('hide');
        reload("stocktab");
      }
    });
  
  }
  

  function deleteAllProducts() {
    if (confirm("Är du säker på att du vill radera alla produkter? Detta kan inte ångras")) {
      if(confirm("100%?")) {
        $.ajax({
          headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
          url: "/admin/webshop/all",
          type: 'DELETE',
          success: function() {
            prompt("Alla produkter raderades");
          }
        });
      }
    }
  }


  function sendMail(list) {
    
  }

  function viewOrders() {
  
    $.ajax({
      url: '../order',
      type: 'GET',
      success(list) {
        console.log(list);
        $("#shipped-grid").empty();
        $("#new-grid").empty();
        for (i = 0; i < list.length; i++) {
          if (list[i].shipped == 1) {
            var prefix = "shipped";
          } else {
            var prefix = "new";
          }
         
  
          $("#" + prefix + "-grid").append(
            "<div class='row'>" +
            "<div id ='personalInfo' class='col'><hr><p class='small'>Datum: " + list[i].date + "</p><p class='small'>Namn: " + list[i].name + "</p><p class='small'> Mail: " + list[i].email + "</p><p class='small'> Tel:  " + list[i].phone + "</p></div>" +
            "<div id='addressInfo' class='col'><hr><p class='small'>Adress: " + list[i].address + "</p><p class='small'> Postkod:  " + list[i].ZIPcode + "</p><p class='small'> Stad: " + list[i].city + "</p><p class='small'> Lgh: " + list[i].apartmentnumber + "</p></div>" +
            "<div id='products" + i + "' ></div></div>");
          $("#date" + i).append(list[i].date);
          var str = list[i].product;
          var n = str.length;
          var y = 0;
          var lablesList = ["Produkt ID: ", "Produkt: ", "Färg: ", "Storlek: ", "Pris: ", "antal: "];
          var Q = 0;
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
            "<button class ='btn btn-primary' onclick=editOrder(" + list[i].ID + ")>ändra</button></div></div>");
          $("#products" + i).append("<hr>");
         
          if (list[i].shipped == 0) {
            var int =1; 
            $('#buttons' + i).append("<button class ='btn btn-primary' onclick='setShipped("+list[i].ID+","+int+")'>Sätt till 'skickad'</button>");
          } else {
            var int =0
            $('#buttons' + i).append("<button class ='btn btn-primary' onclick='setShipped("+list[i].ID+","+int+")'>Sätt till 'ej skickad'</button>");
          }
        }
      }
    });
  
  }
  
  function setShipped(ID, int) {
    
    $.ajax({
      headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
      url: '/admin/shipped/' + ID,
      type: 'PUT',
      datatype: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        "shipped": int,
      }),
      success: function () {
        reload("orderstab");
      }
    });
  }
  
  function deleteOrder(ID) {
    if (confirm("Är du säker på att du vill ta bort ordern?")) {
      reallyDeleteOrder(ID);
    }
    function reallyDeleteOrder(ID) {
      $.ajax({
        headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
        url: '/order/' + ID,
        type: 'DELETE',
        success: function () {
          reload("orderstab");
        }
      });
    }
  }
  
  function editOrder(ID) {

    $.ajax({
      url: '../order/' + ID,
      type: 'GET',
      success(order) {
        document.getElementById("name-input").value = order.name;
        document.getElementById("email-input").value = order.email;
        document.getElementById("phone-input").value = order.phone;
        document.getElementById("address-input").value = order.address;
        document.getElementById("city-input").value = order.city;
        document.getElementById("ZIPcode-input").value = order.ZIPcode;
        document.getElementById("apartmentnumber-input").value = order.apartmentnumber;
        document.getElementById("product-input").value = order.product;
      }
    });

    $('#edit-order').modal('show');
    document.getElementById("edit-modal-footer").innerHTML = "";
    $("#edit-modal-footer").append("<button type='button' class='btn btn-secondary' data-dismiss='modal'>Avbryt</button>" +
      "<button type='button' class='btn btn-secondary' onclick=submitEditOrder(" + ID + ") data-dismiss='modal'>Verkställ</button>"
    );
  }
  
  function submitEditOrder(ID) {
    $.ajax({
      headers: { "Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token },
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
        reload("orderstab");
      }
    });
  }
  