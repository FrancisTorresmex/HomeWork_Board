var lstTask = [];
var lstTaskInitial = [];
var isModeDay = true;

$(document).ready(function () {
    //$("#ItemdraggablexId").draggable({
    //    containment: "#containerTasks"
    //});
    ajaxTask('/Home/GetTask', 'GET', null, successGetTasks);
});

function successGetTasks(data) { //Cargar tareas guardadas
    $.each(data, function (idx, tsk) {
        chargeCreateTaskInitial(tsk);
    });
    
    
}

/* Agregar tarea */

var taskDiv =
    '<div id="ItemdraggablexId" class="card ui-widget-content cardDraggableItem" draggable="true" style="width: 18rem;">' +
    '<div class="card-body">' +

    '<div class="col-md-12 btnBarTask">' +
    '<button class="deleteTaskCls" id="deleteTaskxId">X</button>' +
    '<input id="colorTaskxId" class="colorTask" type="color" value="#ff0000" id = "color-picker" />' +
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
        containment: "#allTasks",
        cursor: 'move',
        scroll: true,
        scrollSensitivity: 100,
        scrollSpeed: 100,
        stop: function (event, ui) {
            var position = ui.position;
            editTask(idRandom, position);
        }
    });

    //$("#" + idTaskDraggable).position({
    //    my: "-2px",
    //    at: "-12.3438px",
    //    of: "#allTasks"
    //});

    changeColorTask(idRandom);
    addTaskToList(idRandom);

});

function chargeCreateTaskInitial(taskObj) { 

    var taskElement = taskDiv.replace(/xId/g, taskObj.id);
    
    $("#allTasks").append(taskElement);

    var idTaskDraggable = $("#Itemdraggable" + taskObj.id).attr("id");
    $("#" + idTaskDraggable).draggable({ //Contenedor donde se arrastra
        containment: "#allTasks",
        cursor: 'move',
        scroll: true,
        scrollSensitivity: 100,
        scrollSpeed: 100,
        stop: function (event, ui) {
            var position = ui.position;
            editTask(taskObj.id, position);
        }
    }).on('touchstart', function () { //mover en celuar (touchstart)
        $(this).draggable();
    });

    $("#lblTitle" + taskObj.id).text(taskObj.title);
    $("#lblDesc" + taskObj.id).text(taskObj.description);
    $('#colorTask' + taskObj.id).val(taskObj.color);

    $('#Itemdraggable' + taskObj.id).css({ top: taskObj.top, left: taskObj.left });
    $('#Itemdraggable' + taskObj.id).css("border-color", "darkgray");
    $('#Itemdraggable' + taskObj.id).css("border-width", "4px");
    $('#Itemdraggable' + taskObj.id).css("border-style", "solid");

    //$("#" + idTaskDraggable).position({
    //    my: taskObj.top.toString(),
    //    at: taskObj.left.toString(),
    //    of: "#allTasks"
    //});

    changeColorTask(taskObj.id);

    $('#colorTask' + taskObj.id).trigger('change'); //invocar el change al inicio
    lstTask.push(taskObj);



}

function addTaskToList(idTask) {

    var positionTask = $("#Itemdraggable" + idTask).position();

    var obj = {
        id: idTask,
        title: $("#lblTitle" + idTask).text(),
        description: $("#lblDesc" + idTask).text(),
        top: positionTask.top,
        left: positionTask.left,
        color: $('#colorTask' + idTask).val()
    };

    saveTask(obj);
    lstTask.push(obj);
    

}

function editTask(idTask, newPositionTsk = null) {
    var taskEditObj = $.grep(lstTask, function (tsk) { //revisa si existe el objeto, retorna el objeto [0], que solo deberia encontrar uno con esa id, y retorna ese objeto
        return tsk.id == idTask
    })[0];

    if (taskEditObj) { //se eedita el objeto en la lista

        var positionTask = $("#Itemdraggable" + idTask).position();
        if (newPositionTsk != null) {
            positionTask.top = newPositionTsk.top;
            positionTask.left = newPositionTsk.left;
        }

        taskEditObj.id = idTask;
        taskEditObj.title = $("#lblTitle" + idTask).text();
        taskEditObj.description = $("#lblDesc" + idTask).text();
        taskEditObj.top = positionTask.top;
        taskEditObj.left = positionTask.left;
        taskEditObj.color = $('#colorTask' + idTask).val();

        saveTask(taskEditObj);
    }
}


function createIdRandom() {
    var idRandom = Math.random().toString(36).substr(2, 18);
    return idRandom;
}

/* Eliminar tarea */
function deleteTask(idTask) {    
    ajaxTask('/Home/DeleteTask?idTask=' + idTask, 'DELETE', deleteTaskSuccess);
}

function deleteTaskSuccess(data) {

}

/* Cambiar color task */
function changeColorTask(idTask) {
    $('#colorTask' + idTask).change(function () {
        var selectedColor = $(this).val();
        colorTask(idTask, selectedColor);

        //Cambiar color de texto según si es oscuro el background
        var rgb = getRgbColor(selectedColor);
        var luminosidad = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
        if (luminosidad < 0.5) {
            $('#lblTitle' + idTask).css('color', 'white');
            $('#lblDesc' + idTask).css('color', 'white');
        } else {
            $('#lblTitle' + idTask).css('color', 'black');
            $('#lblDesc' + idTask).css('color', 'black');
            $('#deleteTask' + idTask).css("color", 'black');
        }

        editTask(idTask);
        
    });

}
function colorTask(idTask, color) {
    $('#Itemdraggable' + idTask).css("background-color", color);
    $('#deleteTask' + idTask).css("color", color);
}

function getRgbColor(color) {
    var r = parseInt(color.substring(1, 3), 16);
    var g = parseInt(color.substring(3, 5), 16);
    var b = parseInt(color.substring(5, 7), 16);
    return { r: r, g: g, b: b };
}

/* Editar label del titulo y descripción */

$(document).on("click", '.titleLabel', function (event) { //al precionar dentro del label

    var idTaskLblPressed = event.target.id;
    var justId = idTaskLblPressed.replace("lblTitle", "");

    $('#Itemdraggable' + justId).draggable('disable');
    $('#Itemdraggable' + justId).css("border-color", "orange");
    $('#Itemdraggable' + justId).css("border-width", "4px");
    $('#Itemdraggable' + justId).css("border-style", "solid");
    $('#' + idTaskLblPressed).prop('contenteditable', true);
});

$(document).on("blur", '.titleLabel', function (event) { //al precionar fuera del label

    var idTaskLblPressed = event.target.id;
    var justId = idTaskLblPressed.replace("lblTitle", "");

    $('#Itemdraggable' + justId).draggable('enable');
    $('#Itemdraggable' + justId).css("border-color", "darkgray");
    $('#' + idTaskLblPressed).prop('contenteditable', false);

    editTask(justId);
});

$(document).on("click", '.descLabel', function (event) { //al precionar dentro del label

    var idTaskLblPressed = event.target.id;
    var justId = idTaskLblPressed.replace("lblDesc", "");

    $('#Itemdraggable' + justId).draggable('disable');
    $('#Itemdraggable' + justId).css("border-color", "orange");
    $('#Itemdraggable' + justId).css("border-width", "4px");
    $('#Itemdraggable' + justId).css("border-style", "solid");
    $('#' + idTaskLblPressed).prop('contenteditable', true);
});

$(document).on("blur", '.descLabel', function (event) { //al precionar fuera del label

    var idTaskLblPressed = event.target.id;
    var justId = idTaskLblPressed.replace("lblDesc", "");

    $('#Itemdraggable' + justId).draggable('enable');
    $('#Itemdraggable' + justId).css("border-color", "darkgray");
    $('#' + idTaskLblPressed).prop('contenteditable', false);

    editTask(justId);
});


/* Eliminar tarea */
$(document).on("click", ".deleteTaskCls", function (event) {
    var idTaskDelete = $(this).attr("id");
    var justId = idTaskDelete.replace("deleteTask", "");

    $('#Itemdraggable' + justId).remove();
    deleteTask(justId);
    
});

/* Guardar todo */

function saveTask(taskModel) {
    ajaxTask('/Home/SaveTask', 'POST', taskModel, successSaveTask);
}

function successSaveTask(data) {
}

function ajaxTask(url, type, data, funSucess) {
    $.ajax({
        url: url,
        type: type,
        data: data,
        success: funSucess,
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

/* Cambiar modo día y noche */
$(document).on("click", "#changeMode", function () {

    //js
    var container = document.querySelector('#allTasks');
    

    //jquery
    if (isModeDay) {
        isModeDay = !isModeDay;
        $("#bodyInitial").css("background-color", "black");
        $("#changeModeImg").attr("src", "Images/HomeWorkBoard_Night.png");
        $(".footer").css("background-color", "#141314");
        $(".navbar").css("background-color", "#141314");
        $(".txtColorMode").css("color", "white");
        $("#allTasks::-webkit-scrollbar-track").css("background-color", "red");

        //js
        //var scrollbarTrack = document.querySelector('#allTasks ::-webkit-scrollbar-track');
        //const scrollbarThumb = document.querySelector('#allTasks ::-webkit-scrollbar-thumb');
        //scrollbarThumb.background = "blue";
        //scrollbarTrack.background = "white";
        
    }
    else {
        isModeDay = !isModeDay;
        $("#bodyInitial").css("background-color", "white");
        $("#changeModeImg").attr("src", "Images/HomeWorkBoard_Day.png");
        $(".footer").css("background-color", "white");
        $(".navbar").css("background-color", "white");
        $(".txtColorMode").css("color", "black");

        //js
        //var scrollbarTrack = document.querySelector('#allTasks ::-webkit-scrollbar-track');
        //const scrollbarThumb = document.querySelector('#allTasks ::-webkit-scrollbar-thumb');
        //scrollbarThumb.background = "red";
        //scrollbarTrack.background = "dark";
        
    }
});

