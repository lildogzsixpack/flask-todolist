
// add ajax todos
$(document).on( "submit", "#newTodoForm", function(e){
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
                var todoId = ui.draggable.attr("data-id")
                var columnId = $(this).attr("data-column-id")
                var data = {"columnId": columnId}
                var stringData = JSON.stringify(data)

            // ajax for drop event
            $.ajax({
                url: `/move/${todoId}`,
                method: "POST",
                data: stringData,
                contentType: 'application/json;charset=UTF-8',
                dataType: "json",
                    })
                }
            });
        });

        var node =[
            `<div class="card dragable-object" data-id=${data.id}>`,
            `<span class="container"> ${formData['title']}</span>`,
            `<form action="/update${data.id}" method="GET" class="update">`,
            `<input type="submit" value="&#8646;">`,
            `</form>`,
            `<form action="/delete${data.id}" method="POST" class="delete">`,
            `<input type="submit" value="&#10006;">`,
            `</form>`,
            `</div>`
        ].join('');
        
        $("#newTodo").append(node);
        $(".todoInput").val("");
    }
});

// drag and drop jquery-ui
$(function drag() {
    $(".dragable-object").draggable({
        revert: "invalid",
    });

    $(".position").droppable({
        accept: "div",
        tolerance: "touch",
        drop: function(e, ui) {
        ui.draggable.attr("style", "");
        $(this).append(ui.draggable);
        var todoId = ui.draggable.attr("data-id")
        var columnId = $(this).attr("data-column-id")
        var data = {"columnId": columnId}
        var stringData = JSON.stringify(data)

        // ajax for drop event
        $.ajax({
            url: `/move/${todoId}`,
            method: "POST",
            data: stringData,
            contentType: 'application/json;charset=UTF-8',
            dataType: "json",
       })
    }
  });
});

//ajax delete
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