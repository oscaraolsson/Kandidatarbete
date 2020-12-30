$(document).ready(function () {
  viewStock();
});


function viewStock() {
  $.ajax({
    headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
    url: 'admin/lager',
    type: 'GET',
    success(list) {
      list.sort();


      for (var i = 0; i < list.length; i++) {
        $("#stock-main").append("<div class=\"row\">" +
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
}

function editStock(ID) {
  document.getElementById("stock-modal-footer").innerHTML = "";
  $('#edit-stock-modal').modal('show');
  $("#stock-modal-footer").append("<button type='button' class='btn btn-secondary' data-dismiss='modal'>Avbryt</button>"+
  "<button Onclick=\"submitStockChange("+ID+")\" type=\"button\" class=\"btn btn-primary\">Ändra</button>");
  document.getElementById("stock-input").value = document.getElementById("stock-text"+ID).innerHTML;
}
function submitStockChange(ID) {
  $.ajax({
    //headers: { 'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('auth')).token },
    url: 'admin/lager/' + ID,
    type: 'PUT',
    datatype: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      "inStock": document.getElementById("stock-input").value,
    }),
    success: function () {
      $('#edit-stock-modal').modal('hide')
    }
  });

}
