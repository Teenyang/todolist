import { addTaskButton, newTask, taskList, tasksArray, focusEditCurrentTask, doneEditCurrentTask, sortTaskOrder, recordTaskData, exportTaskDataFromLocalStorage, setLocalStorage } from './modules.js';

//~ Listener function
function addTask() {
  newTask.classList.add('show_new_task');
  //* add task為第一個task，其index=0，其他既有task則列入taskLists中 
  focusEditCurrentTask(0);
}

function submitNewTask() {
  const eachTaskData = recordTaskData(newTask);
  sortTaskOrder(this, eachTaskData);

  exportTaskDataFromLocalStorage(tasksArray, taskList);
  setLocalStorage(tasksArray);

  //* 不使用event.preventDefault()，讓提交表單時刷新畫面並更新資料，同時不保存newTask "completed, major" class
  // newTask.classList.remove('completed', 'major');
}

function saveExistTask(event) {
  const taskIndex = event.target.dataset.form;
  const allTasksInList = taskList.querySelectorAll('.task');
  const currentTask = allTasksInList[taskIndex];

  const updateTaskData = recordTaskData(currentTask);
  //* 因uploadData取自addTask<input>再賦值給fileData，故既有task<input>並無內容，而資料更新則需取自fileData textContent
  updateTaskData.file = currentTask.querySelector('.file_data .upload_fileName').textContent;
  updateTaskData.fileUpload = currentTask.querySelector('.file_data .upload_dateMillisecond').textContent;

  //* 先將原本的taskData刪除，再原地插入更新後的updateTask
  tasksArray.splice(taskIndex, 1, updateTaskData);
  setLocalStorage(tasksArray);

  //* 不使用event.preventDefault()，讓提交表單時刷新畫面並更新資料，同時不保存currentTask "editing" class，且恢復顯示所有任務清單
  // currentTask.classList.remove('edit');
  // doneEditCurrentTask(allTasksInList);
}

function cancelTask(event) {
  if (event.target.className === 'task_cancel') {
    window.location.reload();
  }
}

addTaskButton.addEventListener('focus', addTask);
newTask.addEventListener('submit', submitNewTask);
newTask.addEventListener('click', cancelTask);
taskList.addEventListener('click', cancelTask);
taskList.addEventListener('submit', saveExistTask);

export { addTask, submitNewTask, cancelTask, saveExistTask };