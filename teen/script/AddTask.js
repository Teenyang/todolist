import { main, taskList, tasksArray, recordTaskData, updateTaskData, updateLocalStorage } from './modules.js';

// MAIN：Add Task
const addTaskButton = main.querySelector('.add_button');
// New Task
const newTask = main.querySelector('main > .task');
const newTaskForm = newTask.querySelector('#task-edit');
const newTaskTitleCheckbox = newTask.querySelector('.title_group');


// General function
function returnBeforeAddTask() {
  // 顯示addTask button
  addTaskButton.classList.remove('adding');
  // 隱藏task
  newTask.classList.remove('new_task');
  // 清除表單內容
  // newTaskForm.reset();
}


// Listener function
function addTask() {
  // 隱藏addTask button
  addTaskButton.classList.add('adding');
  // 顯示task
  newTask.classList.add('new_task');
}

function cancelAddTask() {
  const deadlineInputs = newTask.querySelectorAll('.deadline input');
  deadlineInputs.forEach(deadlineInput => deadlineInput.type = 'text');

  // 隱藏upload的file信息
  const fileData = newTask.querySelector('.file_data');
  fileData.classList.remove('show');
  fileData.innerHTML = ''

  returnBeforeAddTask();
}

function toggleNewTaskCheckbox(event) {
  if (event.target.className === 'done_task') {
    newTask.classList.toggle('completed', event.target.checked);
  }
  else if (event.target.className === 'marker_star') {
    newTask.classList.toggle('major', event.target.checked);
  }
}

function submitAddTask() {
  // 先以物件形式紀錄task data，再推進tasksArray中進行更新
  const eachTask = recordTaskData(newTask);

  // task順序
  if (newTask.querySelector('.marker_star').checked) {
    // major task永遠在最上方：從（第1個參數）index 0位置開始，刪除（第2個參數）0個元素，並插入eachTask
    tasksArray.splice(0, 0, eachTask);
  }
  else {
    // 新增的一般task：位在major task之後、既有task之前
    const majorTaskCount = document.querySelectorAll('.task.major').length;
    tasksArray.splice(majorTaskCount, 0, eachTask);
  }

  // 將tasksArray更新至taskList區域中
  updateTaskData(tasksArray, taskList);

  // 將tasksArray更新儲存在Storage，並用JSON.stringify將陣列格式轉成字串以便讀取
  updateLocalStorage(tasksArray);

  returnBeforeAddTask();
  newTask.classList.remove('completed', 'major');
  // 不使用event.preventDefault()，讓提交表單時刷新畫面並更新資料
}



// General Function
function compareDate(todayMs, uploadMs) {
  const today = new Date();
  const oneDayMs = 60 * 60 * 24 * 1000;

  const uploadHour = today.getHours();
  const uploadMin = today.getMinutes();
  const uploadSec = today.getSeconds();
  const countdownMs = ((24 - uploadHour) * 3600 + (60 - uploadMin) * 60 + (60 - uploadSec)) * 1000;

  // getMonth()介於0~11
  // const fileUploadTime = `${today.getFullYear()}/${fillZero(today.getMonth() + 1)}/${fillZero(today.getDate())}`;

  if ((todayMs - uploadMs) < countdownMs) {
    return 'today';
  }
  else if (countdownMs <= (todayMs - uploadMs) && (todayMs - uploadMs) < (countdownMs + oneDayMs)) {
    return 'yesterday';
  }
  else if ((todayMs - uploadMs) >= (countdownMs + oneDayMs)) {
    const days = Math.ceil((todayMs - countdownMs) / oneDayMs);
    return `${days} days ago`;
  }
}

// 自動載入以保存在LocalStorage中的tasks
updateTaskData(tasksArray, taskList);


// add new task
addTaskButton.addEventListener('focus', addTask);
newTaskTitleCheckbox.addEventListener('click', toggleNewTaskCheckbox);
// cancel未新增的task：代表reset表單
newTask.addEventListener('reset', cancelAddTask);
newTask.addEventListener('submit', submitAddTask);

export { addTask, toggleNewTaskCheckbox, cancelAddTask, submitAddTask }


// function daysCountdown(uploadMs) {
// }
// setInterval(daysCountdown, 86400);
