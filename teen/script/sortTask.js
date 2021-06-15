import { taskList, tasksArray, updateLocalStorage } from './modules.js';


// General function
// 排序置於前項最末index之後、本項第一個
function sortTask(arr, moveTaskIndex, destinationIndex) {
  const moveTask = arr.splice(moveTaskIndex, 1)[0];
  arr.splice(destinationIndex, 0, moveTask);
  return arr;
}

// function updateLocalStorage(storageArray) {
//   localStorage.setItem('lists', JSON.stringify(tasksArray));
// }

// Listener function

function checkCompletion(event) {
  if (event.target.className !== 'done_task') {
    return;
  }

  const checkboxStatus = event.target.checked;
  const taskIndex = event.target.dataset['done'];

  const allTasks = this.querySelectorAll('.task');
  const eachTaskSpacing = allTasks[1].offsetTop - allTasks[0].offsetTop; // height + gap
  const currentTask = allTasks[taskIndex];
  const generalTaskEndIndex = (allTasks.length - document.querySelectorAll('.task.completed').length) - 1;

  if (checkboxStatus) {
    // 已完成任務：無法設為重要
    currentTask.classList.add('completed');
    tasksArray[taskIndex]['done'] = !tasksArray[taskIndex]['done'];
    currentTask.classList.remove('major');
    tasksArray[taskIndex]['major'] = false;

    // 置於general最末、completed最前
    allTasks.forEach((task, index) => {
      if (taskIndex < index && index <= generalTaskEndIndex) {
        task.style.transform = `translateY(-${eachTaskSpacing}px)`;
        task.style.transition = `all 0.7s`;
      }
    })
    currentTask.style.transform = `translateY(${(generalTaskEndIndex - taskIndex) * eachTaskSpacing}px)`;
    currentTask.style.transition = `all 0.5s`;

    sortTask(tasksArray, taskIndex, generalTaskEndIndex);
  }
  else {
    currentTask.classList.remove('completed');
    tasksArray[taskIndex]['done'] = !tasksArray[taskIndex]['done'];

    // 置於general最末、completed最前
    allTasks.forEach((task, index) => {
      if (generalTaskEndIndex < index && index < taskIndex) {
        task.style.transform = `translateY(${eachTaskSpacing}px)`;
        task.style.transition = `all 0.7s`;
      }
    })
    currentTask.style.transform = `translateY(${(generalTaskEndIndex - taskIndex + 1) * eachTaskSpacing}px)`;
    currentTask.style.transition = `all 0.5s`;

    // 因置於completed最前，但不取代general最末，因此需加回1
    sortTask(tasksArray, taskIndex, generalTaskEndIndex + 1);
  }

  updateLocalStorage(tasksArray);

  // 設定固定時間後重新刷新頁面，讓DOM重新渲染
  setTimeout(() => {
    window.location.reload();
  }, 750);
}

function markupTask(event) {
  if (event.target.className !== 'marker_star') {
    return;
  }

  const checkboxStatus = event.target.checked;
  const taskIndex = event.target.dataset['major'];

  const allTasks = this.querySelectorAll('.task');
  const eachTaskSpacing = allTasks[1].offsetTop - allTasks[0].offsetTop; // height + gap
  const currentTask = allTasks[taskIndex];
  const majorTaskEndIndex = document.querySelectorAll('.task.major').length - 1;

  if (checkboxStatus) {
    // 重要任務
    currentTask.classList.add('major');
    tasksArray[taskIndex]['major'] = !tasksArray[taskIndex]['major'];

    // 置於major最前
    allTasks.forEach((task, index) => {
      if (index < taskIndex) {
        task.style.transform = `translateY(${eachTaskSpacing}px)`;
        task.style.transition = `all 0.7s`;
      }
    })
    currentTask.style.transform = `translateY(-${taskIndex * eachTaskSpacing}px)`;
    currentTask.style.transition = `all 0.5s`;

    const majorTaskStartIndex = 0;
    sortTask(tasksArray, taskIndex, majorTaskStartIndex);
  }
  else {
    currentTask.classList.remove('major');
    tasksArray[taskIndex]['major'] = !tasksArray[taskIndex]['major'];

    // 置於major最末、general最前
    allTasks.forEach((task, index) => {
      if (taskIndex < index && index <= majorTaskEndIndex) {
        task.style.transform = `translateY(-${eachTaskSpacing}px)`;
        task.style.transition = `all 0.7s`;
      }
    })
    currentTask.style.transform = `translateY(${(majorTaskEndIndex - taskIndex) * eachTaskSpacing}px)`;
    currentTask.style.transition = `all 0.5s`;

    sortTask(tasksArray, taskIndex, majorTaskEndIndex);
  }

  updateLocalStorage(tasksArray);

  // 設定固定時間後重新刷新頁面，讓DOM重新渲染
  setTimeout(() => {
    window.location.reload();
  }, 750);
}

// pen只負責展開編輯區塊，若要結束編輯狀態則透過form的cancel或add/save的結果而定
// 若所在表失去focus，則alert提醒要cancel or save
function toggleEditArea(event) {
  if (event.target.className !== 'marker_pen') {
    return;
  }

  event.target.checked = true;
  const checkboxStatus = event.target.checked;
  const taskIndex = event.target.dataset.edit;

  const allTasks = this.querySelectorAll('.task');
  const currentTask = allTasks[taskIndex];

  if (checkboxStatus) {
    currentTask.classList.add('editing');
  }

  updateLocalStorage(tasksArray);


  // 若所在表失去focus，則alert提醒要cancel or save
  currentTask.focus();
}

taskList.addEventListener('click', checkCompletion);
taskList.addEventListener('click', markupTask);
taskList.addEventListener('click', toggleEditArea);

export { checkCompletion, markupTask, toggleEditArea };