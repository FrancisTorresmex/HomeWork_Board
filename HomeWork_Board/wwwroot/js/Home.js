

var lstTask = [];
var lstTaskInitial = [];
var lstTxtBox = [];
var isModeDay = true;
let justClickedEmojiButton = false; 
let openDialogEmoji = false;

$(document).ready(function () {
    //$("#ItemdraggablexId").draggable({
    //    containment: "#containerTasks"
    //});
    ajaxTask('/Home/GetTask', 'GET', null, successGetTasks);
    ajaxTask('/Home/GetTxtBox', 'GET', null, successGetTextBox);
});


function successGetTasks(data) { //Cargar tareas guardadas
    $.each(data, function (idx, tsk) {
        chargeCreateTaskInitial(tsk);
    });

    showAlert('Hi again 🌻', 'success')
    
}

function successGetTextBox(data) {
    $.each(data, function (idx, txtBox) {
        chargeCreateTextBoxInitial(txtBox);
    })
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
    '<textarea id="lblTitlexId" class="titleLabel text-center" placeholder="Title" contenteditable="false"></textarea>' +
    '<div id="btnBarEmojiTxId" style="visibility:hidden">' +
    '<button  type="button" class="emojiInput" id="emojiInputTxId">😄</button>' +
    '<emoji-picker style="display: none;" id="emojiPickerTxId"></emoji-picker>' +
    '</div>' +
    '</div>' +
    
    '<div>' +
    '<textarea id="lblDescxId" class="descLabel text-center" contenteditable="false">New Description</textarea>' +
    '<div id="btnBarEmojiDxId" style="visibility:hidden">' +
    '<button  type="button" class="emojiInput" id="emojiInputDxId">😄</button>' +
    '<emoji-picker style="display: none;" id="emojiPickerDxId"></emoji-picker>' +
    '</div>' +
    '</div>' +

    '</div >' +
    '</div >';
    

$(document).on("click", "#addTask", function () {
    var idRandom = createIdRandom();
    var taskElement = taskDiv.replace(/xId/g, idRandom);
    var position = $(this).position;
    
    
    $("#allTasks").append(taskElement);

    var idTaskDraggable = $("#Itemdraggable" + idRandom).attr("id");
    $("#" + idTaskDraggable).draggable({ //Contenedor donde se arrastra
        containment: "#allTasks",
        //cursor: 'move',
        cursor: 'grab',
        scroll: true,
        scrollSensitivity: 5,
        scrollSpeed: 5,
        stop: function (event, ui) {
            var position = ui.position
            editTask(idRandom, position);
        }
    });

    //$("#" + idTaskDraggable).position({
    //    my: "-2px",
    //    at: "-12.3438px",
    //    of: "#allTasks"
    //});

    
    changeColorTask(idRandom, true);
    addTaskToList(idRandom);
    
});

$(window).resize(function () {
    //$(".cardDraggableItem").each(function () {
    //    var id = $(this).attr("id").replace("Itemdraggable", "");
    //    var position = $(this).offset();
    //    editTask(id, position);
    //});
});

function chargeCreateTaskInitial(taskObj) { 

    var taskElement = taskDiv.replace(/xId/g, taskObj.id);
    
    $("#allTasks").append(taskElement);

    var idTaskDraggable = $("#Itemdraggable" + taskObj.id).attr("id");
    $("#" + idTaskDraggable).draggable({ //Contenedor donde se arrastra
        containment: "#allTasks",
        //cursor: 'move',
        cursor: 'grab',
        scroll: true,
        scrollSensitivity: 5,
        scrollSpeed: 5,
        stop: function (event, ui) {
            var position = ui.position;            
            editTask(taskObj.id, position);
        }
    }).on('touchstart', function () { //mover en celuar (touchstart)
        $(this).draggable();
    });
    
    $("#lblTitle" + taskObj.id).val(taskObj.title);
    $("#lblDesc" + taskObj.id).html(taskObj.description);
    $('#colorTask' + taskObj.id).val(taskObj.color);    

    $('#Itemdraggable' + taskObj.id).css({ top: taskObj.top + 'px', left: taskObj.left + 'px' });
    $('#Itemdraggable' + taskObj.id).css("border-color", "darkgray");
    $('#Itemdraggable' + taskObj.id).css("border-width", "4px");
    $('#Itemdraggable' + taskObj.id).css("border-style", "solid");

    changeColorTask(taskObj.id, true);

    btnEmojiTaskAddEventListenerClick('desc', taskObj.id);
    btnEmojiTaskAddEventListenerClick('title', taskObj.id);

    $('#colorTask' + taskObj.id).trigger('change'); //invocar el change al inicio
    lstTask.push(taskObj);



}

function addTaskToList(idTask) {

    var positionTask = $("#Itemdraggable" + idTask).offset();
    //var positionTask = $("#Itemdraggable" + idTask).position();

    // Pocision en base al scroll ya que el contenedor alltask es relativo, entonces basamos la pocision en el scroll para colocar la tarjeta nueva
    var scrollTop = $("#allTasks").scrollTop();
    var scrollLeft = $("#allTasks").scrollLeft();    
    $('#Itemdraggable' + idTask).css({ top: scrollTop + 'px', left: scrollLeft + 'px' });


    //Agrega color al crearse defecto al inicio en la tarjeta
    var colorTask = $('#colorTask' + idTask).val();
    $('#Itemdraggable' + idTask).css("background-color", '#EEFFB3');
    $('#lblTitle' + idTask).css('color', 'black');
    $('#lblDesc' + idTask).css('color', 'black');
    $('#colorTask' + idTask).val('#EEFFB3');

    var obj = {
        id: idTask,
        title: $("#lblTitle" + idTask).val(),
        description: $("#lblDesc" + idTask).html(),
        top: scrollTop,
        left: scrollLeft,
        color: colorTask
    };

    btnEmojiTaskAddEventListenerClick('title', idTask);
    btnEmojiTaskAddEventListenerClick('desc', idTask);

    saveTask(obj);
    lstTask.push(obj);
    

}

function editTask(idTask, newPositionTsk = null) {
    var taskEditObj = $.grep(lstTask, function (tsk) { //revisa si existe el objeto, retorna el objeto [0], que solo deberia encontrar uno con esa id, y retorna ese objeto
        return tsk.id == idTask
    })[0];

    if (taskEditObj) { //se eedita el objeto en la lista

        var positionTask = $("#Itemdraggable" + idTask).offset();
        if (newPositionTsk != null) {
            positionTask.top = newPositionTsk.top;
            positionTask.left = newPositionTsk.left;
            taskEditObj.top = positionTask.top;
            taskEditObj.left = positionTask.left;
        }

        taskEditObj.id = idTask;
        taskEditObj.title = $("#lblTitle" + idTask).val();
        taskEditObj.description = $("#lblDesc" + idTask).html();        
        taskEditObj.color = $('#colorTask' + idTask).val();

        justClickedEmojiButton = false;
        openDialogEmoji = false;

        saveTask(taskEditObj);
    }
}


function createIdRandom() {
    var idRandom = Math.random().toString(36).substr(2, 18);
    return idRandom;
}

/* Eliminar tarea */
function deleteTask(idTask) {    
    ajaxTask('/Home/DeleteTask?idTask=' + idTask, 'DELETE', deleteeTaskSuccess);
}

function deleteeTaskSuccess(data) {
    showAlert('Saved changes 🐙', 'success');
}



/* Cambiar color task */
function changeColorTask(idTask, isTask = true) {

    if (isTask) {
        $('#colorTask' + idTask).change(function () {
            var selectedColor = $(this).val();
            colorTask(idTask, selectedColor, true);

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
    else {
        $('#colortxtBo' + idTask).change(function () {
            var selectedColor = $(this).val();
            colorTask(idTask, selectedColor, false);
            editTxtBox(idTask);

        });
    }
    

}
function colorTask(idTask, color, isTask) {

    if (isTask) {
        $('#Itemdraggable' + idTask).css("background-color", color);
        $('#deleteTask' + idTask).css("color", color);
    }
    else {
        $('#textBoxDraggable' + idTask).css("color", color);
        $('#deleteTask' + idTask).css("color", color);
    }
    
}

function getRgbColor(color) {
    var r = parseInt(color.substring(1, 3), 16);
    var g = parseInt(color.substring(3, 5), 16);
    var b = parseInt(color.substring(5, 7), 16);
    return { r: r, g: g, b: b };
}

/* Editar label del titulo */

$(document).on("click", '.titleLabel', function (event) { //al precionar dentro del label

    var idTaskLblPressed = event.target.id;
    var justId = idTaskLblPressed.replace("lblTitle", "");

    // Activar edición
    $('#' + idTaskLblPressed).prop('contenteditable', true).focus();
    $('#Itemdraggable' + justId).draggable('disable');
    $('#Itemdraggable' + justId).css("border-color", "orange");
    $('#Itemdraggable' + justId).css("border-width", "4px");
    $('#Itemdraggable' + justId).css("border-style", "solid");
    $('#btnBarEmojiT' + justId).css('visibility', 'visible');    


    // Escuchador temporal para detectar click fuera
    $(document).on("click.outsideEdit_" + justId, function (e) {


        //evitar que se cierren los botones al cambiar de color por ejemplo
        if (!$(e.target).closest('#lblTitle' + justId).length &&
            !$(e.target).closest('#btnBarEmojiT' + justId).length) {

            // Click fuera: desactivar edición
            $('#' + idTaskLblPressed).prop("contenteditable", false);
            $('#btnBarEmojiT' + justId).css('visibility', 'hidden');            
            $('#Itemdraggable' + justId).draggable('enable');
            $('#' + idTaskLblPressed).css("border-color", "transparent");

            //solo aplica cerrar el menu de emojis si se preciono el boton de emojis
            if (justClickedEmojiButton && openDialogEmoji) {
                $('#emojiPickerT' + justId).hide();
            }
           

            editTask(justId);

            // Quitar este manejador para que no se quede activo
            $(document).off("click.outsideEdit_" + justId);
        }
    });

});


$(document).on("click", '.descLabel', function (event) { //al precionar dentro del label

    var idTaskLblPressed = event.target.id;
    var justId = idTaskLblPressed.replace("lblDesc", "");    


    // Activar edición
    $('#' + idTaskLblPressed).prop('contenteditable', true).focus(); //con esto se hace focus al elemento y permite usar click.outsideEdit_ despues para detectar el pierde de foco
    $('#Itemdraggable' + justId).draggable('disable');
    $('#Itemdraggable' + justId).css("border-color", "orange");
    $('#Itemdraggable' + justId).css("border-width", "4px");
    $('#Itemdraggable' + justId).css("border-style", "solid");
    $('#btnBarEmojiD' + justId).css('visibility', 'visible');

    // Escuchador temporal para detectar click fuera
    $(document).on("click.outsideEdit_" + justId, function (e) {

        //evitar que se cierren los botones al cambiar de color por ejemplo
        if (!$(e.target).closest('#lblDesc' + justId).length &&
            !$(e.target).closest('#btnBarEmojiD' + justId).length) {

            // Click fuera: desactivar edición
            $('#' + idTaskLblPressed).prop("contenteditable", false);
            $('#btnBarEmojiD' + justId).css('visibility', 'hidden');
            $('#Itemdraggable' + justId).draggable('enable');
            $('#' + idTaskLblPressed).css("border-color", "transparent");

            //solo aplica cerrar el menu de emojis si se preciono el boton de emojis
            if (justClickedEmojiButton && openDialogEmoji) {
                $('#emojiPickerD' + justId).hide();
            }       

            editTask(justId);

            // Quitar este manejador para que no se quede activo
            $(document).off("click.outsideEdit_" + justId);
        }
    });

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
    showAlert('Saved changes 🐙', 'success');
}

function ajaxTask(url, type, data, funSucess) {
    $.ajax({
        url: url,
        type: type,
        data: data,
        success: funSucess,
        error: function (xhr, status, error) {
            showAlert('Oops, an error occurred. Please try again 🔌', 'error');
        }
    });
}

/* Agregar caja de texto */

var textBox =

    '<div id="textBoxDivDraggablexId" class="card ui-widget-content textBoxDivDraggableItem" draggable="true"  style="display: inline-block;">' +

    '<div class="col-md-12 btnBarTxtBox" id="btnBarBoxTxtxId" style="visibility:hidden">' +
    '<button class="deleteTxtBoxCls" id="deleteTxtBoxId">X</button>' +
    '<input id="colortxtBoxId" class="colorTask" type="color" value="#ff0000" id="color-picker" />' +
    '</div >' +

    '<div id="textBoxDraggablexId" class="textBoxDraggableItem text-center" contenteditable="false">New box text</div>' +

    '<div id="btnBarEmojiTxtxId" style="visibility:hidden">' +
    '<button  type="button" class="emojiInput" id="emojiInputTxtxId">😄</button>' +
    '<emoji-picker style="display: none;" id="emojiPickerTxtxId"></emoji-picker>' +
    '</div>' +

    '</div>';
    
function chargeCreateTextBoxInitial(txtObj) {

    var txtElement = textBox.replace(/xId/g, txtObj.id);

    $("#allTasks").append(txtElement);

    var idTxtBoxDraggable = $("#textBoxDivDraggable" + txtObj.id).attr("id");
    $("#" + idTxtBoxDraggable).draggable({ //Contenedor donde se arrastra
        containment: "#allTasks",
        cursor: 'grab',
        scroll: true,
        scrollSensitivity: 5,
        scrollSpeed: 5,
        //start: function (event, ui) {
        //    $(this).css('cursor', 'grab'); //al arrastrarlo ya saldra el cursor de mano
        //},
        stop: function (event, ui) {
            var position = ui.position;
            editTxtBox(txtObj.id, position);
        }
    }).on('touchstart', function () { //mover en celuar (touchstart)
        $(this).draggable();
    });

    $("#textBoxDraggable" + txtObj.id).html(txtObj.description);    
    $('#colortxtBo' + txtObj.id).val(txtObj.color);

    $('#textBoxDivDraggable' + txtObj.id).css({ top: txtObj.top + 'px', left: txtObj.left + 'px'});    

    changeColorTask(txtObj.id, false);

    $('#colortxtBo' + txtObj.id).trigger('change'); //invocar el change al inicio

    btnEmojiTxtBoxAddEventListenerClick(txtObj.id);

    lstTxtBox.push(txtObj);

}


function editTxtBox(idTxt, newPositionTxt = null) {
    var txtEditObj = $.grep(lstTxtBox, function (txtBox) { //revisa si existe el objeto, retorna el objeto [0], que solo deberia encontrar uno con esa id, y retorna ese objeto
        return txtBox.id == idTxt
    })[0];

    if (txtEditObj) { //se eedita el objeto en la lista

        var positionTask = $("#textBoxDivDraggable" + idTxt).offset();
        if (newPositionTxt != null) {
            positionTask.top = newPositionTxt.top;
            positionTask.left = newPositionTxt.left;
            txtEditObj.top = positionTask.top;
            txtEditObj.left = positionTask.left;
        }

        txtEditObj.id = idTxt;        
        txtEditObj.description = $("#textBoxDraggable" + idTxt).html();
        txtEditObj.color = $('#colortxtBo' + idTxt).val();

        justClickedEmojiButton = false;
        openDialogEmoji = false;   

        saveTxtBox(txtEditObj);

        
    }
}

function saveTxtBox(txtModel) {
    ajaxTask('/Home/SaveTxtBox', 'POST', txtModel, successSaveTxt);
}

function successSaveTxt() {
    showAlert('Saved changes 🐙', 'success');
}

$(document).on("click", "#addTextBox", function () {
    var idRandom = createIdRandom();
    var textBoxElement = textBox.replace(/xId/g, idRandom);



    $("#allTasks").append(textBoxElement);

    var idTaskDraggable = $("#textBoxDivDraggable" + idRandom).attr("id");
    $("#" + idTaskDraggable).draggable({ //Contenedor donde se arrastra
        containment: "#allTasks",
        //cursor: 'move',
        cursor: 'grab',
        scroll: true,
        scrollSensitivity: 5,
        scrollSpeed: 5,
        stop: function (event, ui) {
            //var position = $(this).position();
            var position = ui.position
            editTxtBox(idRandom, position);
        }
    });

    btnEmojiTxtBoxAddEventListenerClick(idRandom);

    changeColorTask(idRandom, false);
    addTxtBoxToList(idRandom);

});

function addTxtBoxToList(idTxtBox) {


    var positionBox = $("#textBoxDivDraggable" + idTxtBox).offset();
    //var positionBox = $("#textBoxDivDraggable" + idTxtBox).position();

    // Pocision en base al scroll ya que el contenedor alltask es relativo, entonces basamos la pocision en el scroll para colocar la nueva caja
    var scrollTop = $("#allTasks").scrollTop();
    var scrollLeft = $("#allTasks").scrollLeft() + $("#addTextBox").offset().left; //se le suma la pocision left (eje x) de addTextBox para que aparezca debajo del boton de agregar caja
    $('#textBoxDivDraggable' + idTxtBox).css({ top: scrollTop + 'px', left: scrollLeft + 'px' });


    //Agrega color al crearse defecto al inicio en la tarjeta
    $('#colortxtBo' + idTxtBox).val('#D57A53');
    $('#textBoxDivDraggable' + idTxtBox).css("color", '#D57A53');
    var colorBox = $('#colortxtBo' + idTxtBox).val();

    var obj = {
        id: idTxtBox,
        description: $("#textBoxDivDraggable" + idTxtBox).html(),
        top: scrollTop,
        left: scrollLeft,
        color: colorBox
    };

    saveTxtBox(obj);
    lstTxtBox.push(obj);


}

$(document).on("click", ".deleteTxtBoxCls", function (event) {
    var idTxtBoxDelete = $(this).attr("id");
    var justId = idTxtBoxDelete.replace("deleteTxtBo", "");

    $('#textBoxDivDraggable' + justId).remove();
    deleteTxtBox(justId);

});

function deleteTxtBox(idTxtBox) {
    ajaxTask('/Home/DeleteTxtBox?idTxtBox=' + idTxtBox, 'DELETE', deleteTxtBoxSuccess);
}

function deleteTxtBoxSuccess(data) {
    showAlert('Saved changes 🐙', 'success');
}

$(document).on("click", '.textBoxDraggableItem', function (event) { //al precionar dentro del label


    var idTaskLblPressed = event.target.id;
    var justId = idTaskLblPressed.replace("textBoxDraggable", "");

    // Activar edición
    $(this).prop("contenteditable", true).focus(); //con esto se hace focus al elemento y permite usar click.outsideEdit_ despues para detectar el pierde de foco
    $('#btnBarBoxTxt' + justId).css('visibility', 'visible');
    $('#btnBarEmojiTxt' + justId).css('visibility', 'visible');
    $('#textBoxDivDraggableItem' + justId).draggable('disable');

    // Escuchador temporal para detectar click fuera
    $(document).on("click.outsideEdit_" + justId, function (e) {

        if (!$(e.target).closest('#textBoxDivDraggableItem' + justId).length &&
            !$(e.target).closest('#btnBarBoxTxt' + justId).length && //evitar que se cierren los botones al cambiar de color por ejemplo
            !$(e.target).closest('#btnBarEmojiTxt' + justId).length) {
            // Click fuera: desactivar edición
            $('#' + idTaskLblPressed).prop("contenteditable", false);
            $('#btnBarBoxTxt' + justId).css('visibility', 'hidden');
            $('#btnBarEmojiTxt' + justId).css('visibility', 'hidden');
            $('#textBoxDivDraggableItem' + justId).draggable('enable');
            $('#' + idTaskLblPressed).css("border-color", "transparent");

            //solo aplica cerrar el menu de emojis si se preciono el boton de emojis
            if (justClickedEmojiButton && openDialogEmoji) {
                $('#emojiPickerTxt' + justId).hide();
            }

            editTxtBox(justId);

            // Quitar este manejador para que no se quede activo
            $(document).off("click.outsideEdit_" + justId);
        }
    });
    

});

$(document).on("click", ".emojiInput", function (event) {
    
    var idTxtBoxEmoji = $(this).attr("id");
    var justId = idTxtBoxEmoji.replace("emojiInput", "");
    /*$("#emojiPicker" + justId).toggle();*/
    $("#emojiPicker" + justId).show();

    if (openDialogEmoji) {
        $("#emojiPicker" + justId).hide();
    }

    justClickedEmojiButton = true;
    openDialogEmoji = !openDialogEmoji;    

});

function btnEmojiTxtBoxAddEventListenerClick(justId) {

    // Asociar el evento emoji-click al picker correspondiente
    document.getElementById('emojiPickerTxt' + justId).addEventListener('emoji-click', event => {
        const emoji = event.detail.unicode;        

        $("#textBoxDraggable" + justId).html(function (_, currentText) {
            return currentText + emoji;
        });

    });
}

function btnEmojiTaskAddEventListenerClick(type, justId) {
    
    switch (type) {
        case 'title':
            // Asociar el evento emoji-click al picker correspondiente
            document.getElementById('emojiPickerT' + justId).addEventListener('emoji-click', event => {
                const emoji = event.detail.unicode;                

                $('#lblTitle' + justId).val(function (_, currentText) {
                    return currentText + emoji;
                });

            });
            break;

        case 'desc':
            // Asociar el evento emoji-click al picker correspondiente
            document.getElementById('emojiPickerD' + justId).addEventListener('emoji-click', event => {
                const emoji = event.detail.unicode;                

                $('#lblDesc' + justId).html(function (_, currentText) {
                    return currentText + emoji;
                });

            });
            break;

        default: showAlert("Oops, there's a problem, try again 🔌", 'error')
    }

    
}


/* Cambiar modo día y noche */
$(document).on("click", "#changeMode", function () {

    //js
    var container = document.querySelector('#allTasks');
    

    //jquery
    if (isModeDay) {
        isModeDay = !isModeDay;
        $("#bodyInitial").css("background-color", "currentcolor");
        $("#changeModeImg").attr("src", "Images/HomeWorkBoard_Night.png");
        $(".footer").css("background-color", "black");
        $(".navbar").css("background-color", "currentcolor");
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

function showAlert(message, type = "success") {
    var alert = $("#alertDiv");
    alert.removeClass("error"); // Eliminar clase de error si existe
    alert.addClass(type); // Agregar clase de tipo (success o error)
    alert.text(message); // Establecer el mensaje

    alert.fadeIn(); // Mostrar la alerta

    // Ocultar la alerta después de 3 segundos (3000 milisegundos)
    setTimeout(function () {
        alert.fadeOut(); // Desaparece con un efecto
    }, 4000);
}




