import { newTask, taskList, tasksArray, focusEditCurrentTask, setLocalStorage } from './modules.js';

const newTaskTitleCheckbox = newTask.querySelector('.title_group');

//~ Listener function
function toggleNewTaskCheckbox(event) {
  if (event.target.className === 'done_task') {
    newTask.classList.toggle('completed', event.target.checked);
  }
  else if (event.target.className === 'major_task') {
    newTask.classList.toggle('major', event.target.checked);
  }
}

function toggleEditArea(event) {
  if (event.target.className !== 'edit_task') {
    return;
  }

  //! pen只負責展開編輯區塊，一旦展開便將其checked狀態存為true，如需關閉得選擇cancel或save
  event.target.checked = true;
  const checkboxStatus = event.target.checked;
  const taskIndex = event.target.dataset.edit;
  const currentTask = taskList.querySelectorAll('.task')[taskIndex];

  //* edit狀態時無法拖曳task
  currentTask.classList.remove('drag');

  //* 因聚焦任務的index計算另包含AddTask，故在taskList中的index需加1
  focusEditCurrentTask(Number(taskIndex) + 1);

  if (checkboxStatus) {
    currentTask.classList.add('editing');
  }

  setLocalStorage(tasksArray);
}


function modifyTaskTitle(event) {
  if (event.target.className !== 'task_title') {
    return;
  }

  const modifyTitle = event.target.value;
  if (modifyTitle === '') {
    alert('標題不能空白');
    window.location.reload();
    return;
  }

  const taskIndex = event.target.dataset.title;
  tasksArray[taskIndex].title = modifyTitle;
  setLocalStorage(tasksArray);
}

newTaskTitleCheckbox.addEventListener('click', toggleNewTaskCheckbox);
taskList.addEventListener('click', toggleEditArea);
taskList.addEventListener('change', modifyTaskTitle);

export { toggleNewTaskCheckbox, toggleEditArea, modifyTaskTitle };