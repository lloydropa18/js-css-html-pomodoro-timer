const taskContainer = document.querySelector(".task-container");
const submitButton = document.querySelector(".submit-button");
const timeLeftDisplay = document.querySelector("#time-left");
const sliderFill = document.querySelector(".fill");
const startCount = 25 * 60;
let timeLeft = startCount;
let timerId;
let tasks = [
  {
    name: "Practice CSS Animations",
    priority: 1,
  },
  {
    name: "Dev Communicty Work",
    priority: 4,
  },
  {
    name: "Algorithm Studies",
    priority: 3,
  },
];
// sort by priority
const descendingTasks = tasks.sort((taskA, taskB) => {
  return taskA.priority - taskB.priority;
});

//convert seconds to minute format for display
function convertToMin(secondsLeft) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft - minutes * 60;
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

//handle the pause/start functionality
function handleClick(button) {
  switch (button.textContent) {
    case "ACTIVE":
      button.textContent = "PAUSED";
      clearInterval(timerId);
      break;
    case "PAUSED":
      button.textContent = "ACTIVE";
      countDown(button);
      break;
    default:
      const allButtons = document.querySelectorAll(".controller-button");
      allButtons.forEach((button) => {
        button.textContent = "START";
        button.classList.remove("active-button");
        clearInterval(timerId);
        timeLeft = startCount;
        timeLeftDisplay.textContent = convertToMin(timeLeft);
      });
      button.textContent = "ACTIVE";
      button.classList.add("active-button");
      countDown(button);
      break;
  }
}

//countdown timer
function countDown(button) {
  timerId = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.textContent = convertToMin(timeLeft);
    sliderFill.style.width = (timeLeft / startCount) * 100 + "%";
    if (timeLeft <= 0) {
      clearInterval(timerId);
      delete descendingTasks[button.id];
      button.parentNode.remove();
      timeLeft = startCount;
      timeLeftDisplay.textContent = convertToMin(timeLeft);
    }
  }, 1000);
}

//create task in the array
function render() {
  descendingTasks.forEach((task, index) => {
    const taskBlock = document.createElement("div");
    const deleteElement = document.createElement("p");
    const taskTitle = document.createElement("p");
    const controllerButton = document.createElement("button");

    taskBlock.classList.add("task-block");
    deleteElement.classList.add("delete-icon");
    controllerButton.classList.add("controller-button");

    deleteElement.textContent = "☒";
    taskTitle.textContent = task.name;
    controllerButton.textContent = "START";

    controllerButton.setAttribute("id", index);
    controllerButton.addEventListener("click", () =>
      handleClick(controllerButton)
    );
    deleteElement.addEventListener("click", deleteTask);

    taskBlock.append(deleteElement, taskTitle, controllerButton);
    taskContainer.append(taskBlock);
  });
}
render();

//delete a task
function deleteTask() {
  this.parentNode.remove();
  delete descendingTasks[this.parentNode.lastChild.id];
}

//add a task
function addTask() {
  const inputElement = document.querySelector("input");
  let value = inputElement.value;
  if (value) {
    taskContainer.innerHTML = "";
    inputElement.value = "";
    tasks.push({
      name: value,
      priority: tasks.length,
    });
    render();
  }
}

submitButton.addEventListener("click", addTask);
