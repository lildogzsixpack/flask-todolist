$('#addTask').on('submit', function(e) {
    e.preventDefault();

    var form = $(this);
    var formData = {};


    $.each(form.serializeArray(), function(i, field) {
        formData[field.name] = field.value;
    });

    var request = $.ajax({
        url: form.attr('action'),
        method: form.attr('method'),
        data: form.serialize(),
        dataType: "json",
        success: addTodoItem
    });

    function addTodoItem() {
        var node = [
            '<div class="container">',
            '<form action="/edit_task" method="POST" class="form-tasks">',
            '<div>' + formData['title'] + '</div>',
            '<input type="submit" value="Edit" class="btn td" name="edit_task">',
            '</form>',
            '<form class="form-tasks">',
            '<input type="submit"  id="delete_task" value="Delete" class="btn td" name="delete_task">',
            '</form>',
            '<select>',
            '<option>To Do</option>',
            '<option>WIP</option>',
            '<option>Done</option>',
            '</select>',
            '</div>'
        ].join('');

        var todoItem = $("#new-todo-item");
        $("#newTask").append(node);
        $("#new-todo-item").val("");
    }
});