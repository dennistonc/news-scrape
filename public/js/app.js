//Scrape button
$(".scrape").on("click", function () {
  $.ajax({
      method: "GET",
      url: "/scrape"
  }).then(function (data) {
      console.log(data)

      location.reload()
  }).catch(function (error) {
      console.log(error)
  });
})

//Save article
$(".save-article").on("click", function () {
  // event.preventDefault();
  var thisId = $(this).attr("data-id");
  $.ajax({
      method: "PUT",
      url: "articles/saved/" + thisId
    }).then(function (data) {
        location.reload()
        $(".clear").remove();

    }).catch(function (error) {
        console.log(error)
    });
})

$(".trigger").on("click", function () {
  var thisId = $(this).attr("data-id");
  $("#article-list").empty();
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
  }).then(function (data) {
      console.log(data)
      $("#note-modal-label").html(data.title.trim())
      for (var i = 0; i < data.note.length; i++) {
          $("#article-list").append(`<li style="font-size:18px">${data.note[i].body}<a style="float: right;" data-id="${data._id}" note-data-id="${data.note[i]._id}" id="delete-note" class="btn btn-danger">X</a></li>`)
      }
      location.reload()
  }).catch(function (error) {
      console.log(error)
  });
})

//Delete Article button
$(".delete").on("click", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
      method: "PUT",
      url: "articles/deleted/" + thisId
  }).then(function (data) {
      location.reload()
  }).catch(function (error) {
      console.log(error)
  });
});

//Save Note button
$(".save-note").on("click", function () {
  var thisId = $(this).attr("data-id");
  if (!$("#input-note").html("")) {
      alert("Please enter a note before saving.")
  } else {
      $.ajax({
          method: "PUT",
          url: "/notes/saved/" + thisId,
          data: {
              body: $("#input-note").val()
          }
      }).then(function (data) {
          // Log the response
          console.log(data);
          // Empty the notes section
          $("#input-note").val("");
          $("#note-modal").modal("hide");
          location.reload()
      }).catch(function (error) {
          console.log(error)
      });
  }
});

//Delete Note button
$(document).on("click", "#delete-note", function (event) {
  event.preventDefault()

  var noteId = $(this).attr("note-data-id")
  $.ajax({
      method: "DELETE",
      url: "/notes/deleted/" + noteId
  }).then(function (data) {
      console.log(data)
      $("#note-modal").hide();
      location.reload()
  }).catch(function (error) {
      console.log(error)
  });
});