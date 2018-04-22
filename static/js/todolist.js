$('#addTask').on('submit', function(e) {
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
        var node = [
            `<div class="container">`,
            `<form action="/edit_task" method="POST" class="form-tasks" id="editTask">`,
            `<div>  ${formData['title']}  </div>`,
            `<input type="submit" value="Edit" class="btn td" name="editTask">`,
            `<input type="hidden" value="${data.id}" name="task_to_edit">`,
            `</form>`,
            `<form action="/delete_task" method="POST" class="form-tasks delete">`,
            `<input type="submit" value="Delete" class="btn td" name="deleteTask">`,
            `<input type="hidden" value="${data.id}" name="task_to_delete">`,
            `</form>`,
            `<select>`,
            `<option>To Do</option>`,
            `<option>WIP</option>`,
            `<option>Done</option>`,
            `</select>`,
            `</div>`
        ].join('');

        var todoItem = $("#newTodo");
        $("#newTask").append(node);
        $("#newTodo").val("");
    }
});

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
