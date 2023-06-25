$(document).ready(function() {
    //$("#ItemdraggablexId").draggable({
    //    containment: "#containerTasks"
    //});

});



/* Agregar tarea */

var taskDiv =
    '<div id="ItemdraggablexId" class="card ui-widget-content cardDraggableItem" draggable="true" style="width: 18rem; top:26px; left:-12px;">' +
    '<div class="card-body">' +

    '<div>' +
    '<button class="deleteTaskCls" id="deleteTaskxId"><i class="fa fa-times" aria-hidden="true"></i></button>' +
    '</div >' +

    '<div>' +
    '<div id="lblTitlexId" class="titleLabel text-center" contenteditable="false">New Title</div>' +
    '</div>' +

    '<div>' +
    '<div id="lblDescxId" class="descLabel text-center" contenteditable="false">New Description</div>' +
    '</div>' +

    '</div >' +
    '</div >';
    

$(document).on("click", "#addTask", function () {
    var idRandom = createIdRandom();
    var taskElement = taskDiv.replace(/xId/g, idRandom);


    
    $("#allTasks").append(taskElement);

    var idTaskDraggable = $("#Itemdraggable" + idRandom).attr("id");
    $("#" + idTaskDraggable).draggable({ //Contenedor donde se arrastra
        containment: "#containerTasks"
    });

    $("#" + idTaskDraggable).position({
        my: "39px",
        at: "0px",
        of: "#containerTasks"
    });

    

    
});

function createIdRandom() {
    var idRandom = Math.random().toString(36).substr(2, 18);
    return idRandom;
}

/* Editar label del titulo y descripción */

$(document).on("click", '.titleLabel', function (event) { //al precionar dentro del label

    var idTaskLblPressed = event.target.id;
    var justId = idTaskLblPressed.replace("lblTitle", "");

    $('#Itemdraggable' + justId).draggable('disable');
    $('#Itemdraggable' + justId).css("border-color", "orange");
    $('#' + idTaskLblPressed).prop('contenteditable', true);
});

$(document).on("blur", '.titleLabel', function (event) { //al precionar fuera del label

    var idTaskLblPressed = event.target.id;
    var justId = idTaskLblPressed.replace("lblTitle", "");

    $('#Itemdraggable' + justId).draggable('enable');
    $('#Itemdraggable' + justId).css("border-color", "darkgray");
    $('#' + idTaskLblPressed).prop('contenteditable', false);
});

$(document).on("click", '.descLabel', function (event) { //al precionar dentro del label

    var idTaskLblPressed = event.target.id;
    var justId = idTaskLblPressed.replace("lblDesc", "");

    $('#Itemdraggable' + justId).draggable('disable');
    $('#Itemdraggable' + justId).css("border-color", "orange");
    $('#' + idTaskLblPressed).prop('contenteditable', true);
});

$(document).on("blur", '.descLabel', function (event) { //al precionar fuera del label

    var idTaskLblPressed = event.target.id;
    var justId = idTaskLblPressed.replace("lblDesc", "");

    $('#Itemdraggable' + justId).draggable('enable');
    $('#Itemdraggable' + justId).css("border-color", "darkgray");
    $('#' + idTaskLblPressed).prop('contenteditable', false);
});


/* Eliminar tarea */
$(document).on("click", ".deleteTaskCls", function (event) {
    var idTaskDelete = $(this).attr("id");
    var justId = idTaskDelete.replace("deleteTask", "");

    $('#Itemdraggable' + justId).remove();
    
});



