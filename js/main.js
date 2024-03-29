"use-strict";

let inputField = document.querySelector('[type="text"]');
let submit = document.querySelector('[type="submit"]');
let tasksDiv = document.querySelector(".tasks-area");
let deleteAudio = new Audio("../media/audio/short-success-sound.mp3");
let clearAudio = new Audio("../media/audio/clearall.mp3");
let alertAudio = new Audio("../media/audio/alert-popwav.wav");
let clearBtn = document.querySelector(".clear-btn");
let submitBtnClicked = false;

window.onload = (_) => {
  inputField.focus();
};

let arrayOfTasks = [];
if (localStorage.getItem("task")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("task"));
}

getTaskFromLocalStorage();

submit.onclick = function () {
  if (inputField.value !== "" && inputField.value.trim()) {
    addTaskToArray(inputField.value);
    inputField.value = "";
    submitBtnClicked = true;
    popupCreation();
  }
};

/* For Clear All Tasks */
clearBtn.addEventListener("click", () => {
  let confirmAlert = confirm(
    "Be careful ⚠️ ,\nAre You Sure To Clear All Your Tasks !"
  );
  if (confirmAlert) {
    arrayOfTasks = [];
    localStorage.clear();
    tasksDiv.innerHTML = "";
    clearAudio.play();
  }
});

/* popup */
function popupCreation() {
  let popupAdditionAlert = document.createElement("div");
  popupAdditionAlert.style.cssText =
    "position: absolute; top: 20px; right: 40px; background-color:#eee; color:red; width: fit-content; height:40px; line-height:0; padding:20px; text-align:center; font-size: 18px; font-weight: bolder; font-style: italic; border-radius: 6px; z-index:100;";
  popupAdditionAlert.appendChild(
    document.createTextNode("task add successfully 🙏🏻")
  );
  document.body.appendChild(popupAdditionAlert);
  alertAudio.play();
  setTimeout(function () {
    popupAdditionAlert.remove();
  }, 2000);
}

/* For Enter And ESC Buttons Accessibility */
inputField.addEventListener("keyup", (e) => {
  if (e.which === 13 && inputField.value.trim()) {
    addTaskToArray(inputField.value);
    inputField.value = "";
    popupCreation();
  }
});
inputField.addEventListener("keyup", (e) => {
  if (e.which === 27 && inputField.value.trim()) {
    inputField.value = "";
  }
});

// delete From localStorage
tasksDiv.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    // Remove Element From Page
    e.target.parentElement.remove();
    deleteAudio.play();
    // Remove Task From LocalStorage
    deleteTaskFromLocalStorage(e.target.parentElement.getAttribute("data-id"));
  }
});

function addTaskToArray(taskText) {
  const task = {
    id: Date.now(),
    title: taskText,
    hasNestedTask: false,
    done: false,
  };
  arrayOfTasks.push(task);
  addElemntsIntoPage(arrayOfTasks);
  addTasksIntoLocalStorage(arrayOfTasks);
}

function addElemntsIntoPage(arrayOfTasks) {
  tasksDiv.innerHTML = "";
  arrayOfTasks.forEach((task) => {
    let div = document.createElement("div");
    div.className = "task";
    div.setAttribute("data-id", task.id);
    div.appendChild(document.createTextNode(task.title));
    let deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.appendChild(document.createTextNode("Delete"));
    deleteBtn.style.cssText =
      "background-color: red; color: white; border: none; padding: 15px; cursor: pointer; border-radius: 6px; font-weight: bold;";
    div.appendChild(deleteBtn);
    tasksDiv.appendChild(div);
    if (task.done) {
      div.className = "done";
    }
  });
}

function addTasksIntoLocalStorage(arrayOfTasks) {
  window.localStorage.setItem("task", JSON.stringify(arrayOfTasks));
}

function getTaskFromLocalStorage(arrayOfTasks) {
  let tasksData = window.localStorage.getItem("task");
  if (tasksData) {
    let task = JSON.parse(tasksData);
    addElemntsIntoPage(task);
  }
}

function deleteTaskFromLocalStorage(taskId) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
  addTasksIntoLocalStorage(arrayOfTasks);
}

tasksDiv.addEventListener("click", (e) => {
  if (e.target.classList.contains("task")) {
    // Toggle Completed For The Task
    checkTaskStatus(e.target.getAttribute("data-id"));
    // Toggle Done Class
    e.target.classList.toggle("done");
    console.log("toggled");
  }
});

function checkTaskStatus(taskId) {
  for (let i = 0; i < arrayOfTasks.length; i++) {
    if (taskId == arrayOfTasks[i].id) {
      arrayOfTasks[i].done == false
        ? (arrayOfTasks[i].done = true)
        : (arrayOfTasks[i].done = false);
    }
  }
  addTasksIntoLocalStorage(arrayOfTasks);
}
