// MAIN：Add Task
const main = document.querySelector('main');
const addTaskButton = main.querySelector('.add_button');
// New Task
const newTask = main.querySelector('main > .task');
const newTaskForm = newTask.querySelector('#task-edit');
const newTaskTitleCheckbox = newTask.querySelector('.title_group');
// taskList：exist tasks
const taskList = document.querySelector('.task_list');

// JSON.parse：將字串轉回原本陣列格式
// 初始值為空陣列，或者若Storage已有紀錄則呈現先前保留的資料
// If the key of getItem() doesn't exist, null is returned. => null為falsy值
const tasksArray = JSON.parse(localStorage.getItem('lists')) || [];


// General Function
function returnBeforeAddTask() {
  // 顯示addTask button
  addTaskButton.classList.remove('adding');
  // 隱藏task
  newTask.classList.remove('new_task');
  // 清除表單內容
  // newTaskForm.reset();
}


// addEventListener Function
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
  updateTasks(tasksArray, taskList);

  // 將tasksArray更新儲存在Storage，並用JSON.stringify將陣列格式轉成字串以便讀取
  updateLocalStorage(tasksArray);

  returnBeforeAddTask();
  newTask.classList.remove('completed', 'major');
  // 不使用event.preventDefault()，讓提交表單時刷新畫面並更新資料
}

function saveTask(event) {
  const taskIndex = event.target.dataset['form'];
  const currentTask = this.querySelectorAll('.task')[taskIndex];
  const updateTask = recordTaskData(currentTask);

  // 先將原先的task data刪除，再插入updateTask
  tasksArray.splice(taskIndex, 1, updateTask);
  updateLocalStorage(tasksArray);

  currentTask.classList.remove('editing');
  // 不使用event.preventDefault()，讓提交表單時刷新畫面並更新資料
}

function modifyTaskTitle(event) {
  if (event.target.className !== 'task_title') {
    return;
  }
  const modifyTitle = event.target.value;
  const taskIndex = event.target.dataset.title;

  // 觸發click事件時，將done狀態進行取反後，更新存至Storage
  tasksArray[taskIndex].title = modifyTitle;
  updateLocalStorage(tasksArray);
}

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
// 排序置於前項最末index之後、本項第一個
function sortTask(arr, moveTaskIndex, destinationIndex) {
  const moveTask = arr.splice(moveTaskIndex, 1)[0];
  arr.splice(destinationIndex, 0, moveTask);
  return arr;
}


function fillZero(number) {
  return (number < 10) ? `0${number} ` : `${number} `;
}

function dateFormat(deadline) {
  // 取開頭四個數字
  const year = Number(deadline.match(/^\d{4}/g));
  // 取開頭為中線（但不包含）之後的兩個數字，且數字後為中線
  const month = Number(deadline.match(/(?<=([-]))\d{2}(?=[-])/g));
  // 取倒數兩個數字
  const date = Number(deadline.match(/\d{2}$/g));

  return `${(year === new Date().getFullYear()) ? '' : year + '/'}${month}/${date}`
}

function recordTaskData(taskArticle) {
  const today = new Date();
  return {
    title: taskArticle.querySelector('.task_header textarea').value,
    done: taskArticle.querySelector('.done_task').checked,
    major: taskArticle.querySelector('.marker_star').checked,
    // edit: false,
    deadlineDate: taskArticle.querySelector('.task_body #date').value,
    deadlineTime: taskArticle.querySelector('.task_body #time').value,
    file: (taskArticle.querySelector('.task_body .upload_file').value).replace(/.*[\/\\]/, ''),
    fileUpload: `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`,
    comment: taskArticle.querySelector('.task_body textarea').value,
  }
}

function updateTasks(tasksArray, taskList) {
  // ${task.done ? 'checked' : ''} -> 若task.done為true，則加上checked屬性
  // join()將所有模板字串接在一起，全部賦值給itemsLists.innerHTML
  taskList.innerHTML = tasksArray.map((task, index) => {
    return `
      <article data-task="${index}" class="task ${task.done ? 'completed' : 'progress'} ${task.major ? 'major' : ''}" >
        <form data-form="${index}" id="task-edit" autocomplete="off">
          <section class="task_header">
            <div class="title_group">
              <input type="checkbox" data-done="${index}" class="done_task" id="doneTask${index}" ${task.done ? 'checked' : ''}>
              <label for="doneTask${index}"><i class="far fa-check"></i></label>
              <textarea data-title="${index}" class="task_title" name="task title" rows="1" placeholder="Type Something Here...">${task.title}</textarea>
              <div class="marker_group">
                <input type="checkbox" data-major="${index}" class="marker_star" id="markerStar${index}" ${task.major ? 'checked' : ''} ${task.done ? 'disabled' : ''}>
                <label for="markerStar${index}">
                  <i class="far fa-star general"></i>
                  <i class="fas fa-star major"></i>
                </label>
                <input type="checkbox" data-edit="${index}" class="marker_pen" id="markerPen${index}" ${task.done ? 'disabled' : ''}>
                <label for="markerPen${index}">
                  <i class="far fa-pen general"></i>
                  <i class="fas fa-pen edit"></i>
                </label>
              </div>
            </div>
            <div class="info_group">
              <span class="${(task.deadlineDate !== '') ? 'show' : ''}"><i class="far fa-calendar-alt"></i>${(task.deadlineDate !== '') ? dateFormat(task.deadlineDate) : ''}</span>
              <i class="${(task.fileUpload !== '') ? 'show' : ''} far fa-file"></i>
              <i class="${(task.comment !== '') ? 'show' : ''} far fa-comment-dots"></i>
            </div>
          </section>
          <div class="task_content">
            <section class="task_body">
              <div class="edit_item deadline">
                <label><i class="far fa-calendar-alt fa-fw"></i>Deadline</label>
                <div class="edit_content">
                  <input data-date="${index}" id="date" type="text" class="deadline_date" placeholder="yyyy/mm/dd" name="deadline-date" value="${task.deadlineDate}">
                  <input id="time" type="text" class="deadline_time" placeholder="hh:mm" name="deadline-time" value="${task.deadlineTime}">
                </div>
              </div>
              <div class="edit_item file">
                <label><i class="far fa-file fa-fw"></i>File</label>
                <div class="edit_content">
                  <div class="file_data ${(task.file.length > 0) ? 'show' : ''}">
                    <p>${task.file}</p>
                    <span>uploaded ${task.fileUpload}</span>
                  </div>
                  <input id="upload${index}" type="file" class="upload_file" name="file-upload" value="${task.file}">
                  <label for="upload${index}"><i class="fal fa-plus fa-fw"></i></label>
                </div>
              </div>
              <div class="edit_item comment">
                <label><i class="far fa-comment-dots fa-fw"></i>Comment</label>
                <div class="edit_content">
                  <textarea class="edit_comment" name="comment" placeholder="Type your memo here…" readonly>${task.comment}</textarea>
                </div>
              </div>
            </section>
            <section class="task_footer">
              <button type="button" class="task_cancel"><i class="fal fa-times"></i>Cancel</button>
              <button type="submit" class="task_editing"><i class="fal fa-plus"></i>Save</button>
            </section>
          </div>
        </form>
      </article>
    `
  }).join('');
  // 儲存後的submit button文字變成“Save”
}

function updateLocalStorage(storageArray) {
  localStorage.setItem('lists', JSON.stringify(tasksArray));
}

// 自動載入以保存在LocalStorage中的tasks
export default updateTasks(tasksArray, taskList);


// add new task
addTaskButton.addEventListener('focus', addTask);
newTaskTitleCheckbox.addEventListener('click', toggleNewTaskCheckbox);
// cancel未新增的task：代表reset表單
newTask.addEventListener('reset', cancelAddTask);
newTask.addEventListener('submit', submitAddTask);

// exist tasks
taskList.addEventListener('input', modifyTaskTitle);
taskList.addEventListener('click', checkCompletion);
taskList.addEventListener('click', markupTask);
taskList.addEventListener('click', toggleEditArea);
taskList.addEventListener('submit', saveTask);
// cancel既有的task：代表不儲存本次修改的結果


// function daysCountdown(uploadMs) {
// }
// setInterval(daysCountdown, 86400);
