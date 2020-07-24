"use strict";function TodoTask(t,s,i,a){this.taskId=t,this.taskName=s,this.statusId=i,this.priorityId=a};"use strict";var tasks=[new TodoTask(1,"Learn JS",2,3),new TodoTask(2,"Be Happy",3,2),new TodoTask(3,"Build House",4,1)];;"use strict";var start=function(t){localStorage.getItem("tasks")||localStorage.setItem("tasks",JSON.stringify(t)),showTasksBoard()},showTasksBoard=function(){var t=$("#wrapper").html("");$("<button/>",{id:"create-task",text:"Create new Task"}).click(createNewTask).appendTo(t),$(t).append($("<div/>",{id:"tasks"}));var e=JSON.parse(localStorage.getItem("tasks"));sendRequest(e)},sendRequest=function(t){fetch("priorities-and-statuses.json").then(function(t){return t.json()}).then(function(e){t.forEach(function(t){return createTaskBlock(t,e)})})},createNewTask=function(){var t=$("#wrapper").html(""),e=$("<div/>",{id:"new-block"}).appendTo(t);fetch("priorities-and-statuses.json").then(function(t){return t.json()}).then(function(t){createForm(e,"New","Create new Task"),setSelects(null,t),$("<button/>",{id:"new-btn-save",text:"Save"}).click(saveNewTask).appendTo(e)})},saveNewTask=function(){var t=JSON.parse(localStorage.getItem("tasks")),e=0;t.forEach(function(t){t.taskId>e&&(e=t.taskId)});var a=$("#task-name").val(),s=parseInt($("#select-status option:selected").val()),n=parseInt($("#select-priority option:selected").val()),o=new TodoTask(++e,a,s,n);t.push(o),localStorage.setItem("tasks",JSON.stringify(t)),showTasksBoard()},createTaskBlock=function(t,e){var a=t.taskId,s=t.taskName,n=t.statusId,o=t.priorityId,i=$("<div/>",{"data-id":a}).addClass("task");$("<h5/>",{text:"Task Name"}).appendTo(i),$("<input/>",{type:"text",value:s}).attr("readonly",!0).addClass("input").appendTo(i),setFieldOfTask(n,o,i,e);var r=$("<div/>").addClass("taskButtons").css("display","flex").appendTo(i);$("<button/>",{"data-id":a,text:"Edit","data-name":s}).click(editTask).appendTo(r),$("<button/>",{"data-id":a,text:"Remove","data-name":s}).click(removeTask).appendTo(r),$("#tasks").append(i)},setFieldOfTask=function(e,a,t,s){var n="Not Defined",o="Not Defined";$("<h5/>",{text:"Task Status"}).appendTo(t);var i=$("<input/>",{type:"text"}).attr("readonly",!0).addClass("input").appendTo(t);$("<h5/>",{text:"Task Priority"}).appendTo(t);var r=$("<input/>",{type:"text"}).attr("readonly",!0).addClass("input").appendTo(t);s.statuses.forEach(function(t){t.id===e&&(n=t.status)}),s.priorities.forEach(function(t){t.id===a&&(o=t.priority)}),$(i).val(n),$(r).val(o)},removeTask=function(t){var e=t.target.dataset.id,a=t.target.dataset.name,s=$("#wrapper").html("").append($("<div/>",{id:"question-block"}));$("<h2/>",{text:"Remove task ".concat(a)}).appendTo(s),$("<button/>",{"data-id":e,text:"Yes"}).click(confirmRemove).appendTo(s),$("<button/>",{"data-id":e,text:"No"}).click(notConfirmRemove).appendTo(s)},notConfirmRemove=function(){showTasksBoard()},confirmRemove=function(t){var e=parseInt(t.target.dataset.id),a=JSON.parse(localStorage.getItem("tasks")),s=[];a.find(function(t){t.taskId!==e&&s.push(t)}),localStorage.setItem("tasks",JSON.stringify(s)),showTasksBoard()},editTask=function(t){var e=parseInt(t.target.dataset.id);$("#wrapper").html("").append($("<div/>",{id:"edit-block"}));var a=JSON.parse(localStorage.getItem("tasks")).find(function(t){if(t.taskId===e)return t});createFormForEditAndSetFields(a,"#edit-block")},createFormForEditAndSetFields=function(e,a){var s=e.taskName,n=e.taskId;fetch("priorities-and-statuses.json").then(function(t){return t.json()}).then(function(t){createForm(a,"Edit","Edit task ".concat(s)),$("#task-name").val(s),setSelects(e,t),$("<button/>",{id:"edit-btn-save","data-id":n,text:"Save"}).click(saveTask).appendTo(a)})},createForm=function(t,e,a){$("<h2/>",{text:a}).appendTo(t),$("<div/>",{text:"Task Name"}).appendTo(t),$("<input/>",{type:"text",id:"task-name"}).appendTo(t),$("<div/>",{text:"Task Status"}).appendTo(t),$("<select/>",{id:"select-status"}).appendTo(t),$("<div/>",{text:"Task Priority"}).appendTo(t),$("<select/>",{id:"select-priority"}).appendTo(t)},setSelects=function(a,t){var s=$("#select-status"),n=$("#select-priority");t.statuses.forEach(function(t){var e=$("<option/>",{value:t.id,text:t.status});s.append(e),a&&a.statusId===t.id&&$(e).attr("selected",!0)}),t.priorities.forEach(function(t){var e=$("<option/>",{value:t.id,text:t.priority});n.append(e),a&&a.priorityId===t.id&&$(e).attr("selected",!0)})},saveTask=function(t){var e=parseInt(t.target.dataset.id),a=JSON.parse(localStorage.getItem("tasks"));a.find(function(t){t.taskId===e&&(t.taskName=$("#task-name").val(),t.statusId=parseInt($("#select-status").val()),t.priorityId=parseInt($("#select-priority").val()))}),localStorage.setItem("tasks",JSON.stringify(a)),showTasksBoard()};start(tasks);