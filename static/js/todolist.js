// adding tasks
$(document).on( "submit", "#addTask", function(e, drag){
    e.preventDefault();

    var form = $(this);
    var formData = {};

    $.each(form.serializeArray(), function(i, field) {
        formData[field.name] = field.value;
    });

    $.ajax({
        url: form.attr('action'),
        method: form.attr('method'),
        data: form.serialize(),
        dataType: "json",
        success: addTodoItem
    });

    function addTodoItem(data) {
        $(function() {
          $(".dragable-object").draggable({
            revert: "invalid",
          });

          $(".position").droppable({
            accept: "div",
            tolerance: "touch",
            drop: function(e, ui) {
              ui.draggable.attr("style", "");
              $(this).append(ui.draggable);
            }
          });
        });
        var node = [
            `<div class="container col-md-12 card dragable-object">`,
            `<form action="/edit_task" method="POST" class="form-tasks">`,
            `<div>${formData['title']}</div>`,
            `<input type="submit" value="Edit" class="btn td" name="editTask">`,
            `<input type="hidden" value="${data.id}" name="task_to_edit">`,
            `</form>`,
            `<form action="/delete_task" method="POST" class="form-tasks delete">`,
            `<input type="submit" value="Delete" class="btn td" name="deleteTask">`,
            `<input type="hidden" value="${data.id}" name="task_to_delete">`,
            `</form>`,
            `</div>`
        ].join('');

        var todoItem = $("#newTodo");
        $("#newTask").append(node);
        $("#newTodo").val("");
    }
});

// drag and drop jquery-ui
var drag = $(function() {
  $(".dragable-object").draggable({
    revert: "invalid",
  });

  $(".position").droppable({
    accept: "div",
    tolerance: "touch",
    drop: function(e, ui) {
      ui.draggable.attr("style", "");
      $(this).append(ui.draggable);
    }
  });
});

// delete button functionality
$(document).on('click','.delete',function(e) {

    e.preventDefault();
    var form = $(this);

    $.ajax({
        url: form.attr('action'),
        method: form.attr('method'),
        data: form.serialize(),
        dataType: "json",
        success: function() {
            form.parent().remove();
        }
    });
});

