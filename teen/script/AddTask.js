import { main, taskList, tasksArray, focusEditing, doneEditing, recordTaskData, exportTaskDataFromLocalStorage, setLocalStorage } from './modules.js';

const addTaskButton = main.querySelector('.add_button');
const newTask = main.querySelector('main > .task');
const newTaskForm = newTask.querySelector('#task-edit');
const newTaskTitleCheckbox = newTask.querySelector('.title_group');

//~ General function
function reappearAddTaskButton() {
  addTaskButton.classList.remove('hide_button');
  newTask.classList.remove('show_new_task');
  newTaskForm.reset();

  //! 提交表單後恢復顯示所有任務清單
  taskList.style.display = 'block';
}

//~ Listener function
function addTask() {
  addTaskButton.classList.add('hide_button');
  newTask.classList.add('show_new_task');

  //! 展開新增任務的編輯區塊時，將專注在編輯該任務，其他任務則先消失，待任務被cancel或save後才恢復顯示所有任務清單
  taskList.style.display = 'none';
}

function cancelAddTask() {
  const deadlineInputs = newTask.querySelectorAll('.deadline input');
  deadlineInputs.forEach(deadlineInput => deadlineInput.type = 'text');

  reappearAddTaskButton();
  //* 因為upload file資訊取自upload <input>再重新賦值給fileData節點，而無法透過form.reset()重置，
  //* 所以若取消addTask需重整頁面以清空fileData
  window.location.reload();
}

function toggleNewTaskCheckbox(event) {
  if (event.target.className === 'done_task') {
    newTask.classList.toggle('completed', event.target.checked);
  }
  else if (event.target.className === 'major_task') {
    newTask.classList.toggle('major', event.target.checked);
  }
}

function submitAddTask() {
  const eachTask = recordTaskData(newTask);

  const allTasksCount = taskList.querySelectorAll('.task').length;
  const majorTaskCount = taskList.querySelectorAll('.task.major').length;
  const completedTaskCount = taskList.querySelectorAll('.task.completed').length;
  const generalTaskCount = allTasksCount - completedTaskCount;

  if (newTask.querySelector('.major_task').checked) {
    //* major task永遠在最上方：從（第1個參數）index 0位置開始，刪除（第2個參數）0個元素，並插入eachTask
    tasksArray.splice(0, 0, eachTask);
  }
  else if (newTask.querySelector('.done_task').checked) {
    //* 新增的已完成task：位在既有task最末、既有completed task最前
    tasksArray.splice(generalTaskCount, 0, eachTask);
  }
  else {
    //* 新增的一般task：位在major task最末、既有task最前
    tasksArray.splice(majorTaskCount, 0, eachTask);
  }

  exportTaskDataFromLocalStorage(tasksArray, taskList);
  setLocalStorage(tasksArray);

  newTask.classList.remove('completed', 'major');
  reappearAddTaskButton();
  //* 不使用event.preventDefault()，讓提交表單時刷新畫面並更新資料
}

addTaskButton.addEventListener('focus', addTask);
newTaskTitleCheckbox.addEventListener('click', toggleNewTaskCheckbox);
//! cancel未新增的task：代表reset表單
newTask.addEventListener('submit', submitAddTask);
newTask.addEventListener('reset', cancelAddTask);

export { addTask, toggleNewTaskCheckbox, cancelAddTask, submitAddTask };