// MAIN：Add Task
const main = document.querySelector('main');
const addTaskButton = document.querySelector('main > button');
// const addTaskInput = document.querySelector('#add-task-form input');
// MAIN：New Task
const newTask = document.querySelector('main .task');
const newTaskForm = newTask.querySelector('#task-edit');

// taskList：exist tasks
const taskList = document.querySelector('.task_list');


// JSON.parse：將字串轉回原本陣列格式
// 初始值為空陣列，或者若Storage已有紀錄則呈現先前保留的資料
// If the key of getItem() doesn't exist, null is returned. => null為falsy值
const tasksArray = JSON.parse(localStorage.getItem('lists')) || [];

// Listerner Function
function addTask() {
  console.log(this);


  // focus Add Task input：增加class，main form高度變成0
  main.classList.add('adding');
  // 顯示Add Task input下方的new task
  newTask.classList.add('new_task');
}

function cancelTask() {
  cancelButton();
}

function submitAddTask(event) {
  // 阻止<form>預設的提交行為
  event.preventDefault();

  console.log(event.target);

  if (event.target.className === 'marker_star') {
    if (newTask.querySelector('.marker_star').checked) {
      console.log(newTask.querySelector('.marker_star').checked);
      newTask.classList.add('major');
    }
    else {
      newTask.classList.remove('major');
    }
  }

  // task data以物件形式紀錄後再推進tasksArray中
  const eachTask = {
    title: newTask.querySelector('.task_header textarea').value,
    done: newTask.querySelector('.done_task').checked,
    major: newTask.querySelector('.marker_star').checked,
    edit: newTask.querySelector('.marker_pen').checked,
    deadlineDate: newTask.querySelector('.task_body #date').value,
    deadlineTime: newTask.querySelector('.task_body #time').value,
    file: newTask.querySelector('.task_body #upload').files,
    comment: newTask.querySelector('.task_body textarea').value,
  }

  // 新增的task永遠在最上方：從（第1個參數）index 0位置開始，刪除（第2個參數）0個元素，並插入eachTask
  tasksArray.splice(0, 0, eachTask);

  // 將tasksArray更新至taskList區域中
  updateTasks(tasksArray, taskList);

  // 將tasksArray更新儲存在Storage，並用JSON.stringify將陣列格式轉成字串以便讀取
  localStorage.setItem('lists', JSON.stringify(tasksArray));

  // 恢復Add Task input高度並隱藏new task
  cancelButton();
}

function checkCompletion(event) {
  if (event.target.className !== 'done_task') {
    return;
  }
  const checkboxStatus = event.target.checked;
  const taskIndex = event.target.dataset.done;

  // 依checked狀態增刪class
  if (checkboxStatus) {
    this.querySelectorAll('.task')[taskIndex].classList.add('completed');
  }
  else {
    this.querySelectorAll('.task')[taskIndex].classList.remove('completed');
  }

  // 觸發click事件時，將done狀態進行取反後，更新存至Storage
  tasksArray[taskIndex].done = !tasksArray[taskIndex].done;
  localStorage.setItem('lists', JSON.stringify(tasksArray));
}
function toggleEditArea(event) {
  if (event.target.className !== 'marker_pen') {
    return;
  }
  const checkboxStatus = event.target.checked;
  const taskIndex = event.target.dataset.edit;

  // 依checked狀態增刪class
  if (checkboxStatus) {
    this.querySelectorAll('.task')[taskIndex].classList.add('editing');
  }
  else {
    this.querySelectorAll('.task')[taskIndex].classList.remove('editing');
  }

  // 觸發click事件時，將done狀態進行取反後，更新存至Storage
  tasksArray[taskIndex].edit = !tasksArray[taskIndex].edit;
  localStorage.setItem('lists', JSON.stringify(tasksArray));
}
function markupTask(event) {
  if (event.target.className !== 'marker_star') {
    return;
  }
  const checkboxStatus = event.target.checked;
  const taskIndex = event.target.dataset.major;

  // 依checked狀態增刪class
  if (checkboxStatus) {
    this.querySelectorAll('.task')[taskIndex].classList.add('major');
  }
  else {
    this.querySelectorAll('.task')[taskIndex].classList.remove('major');
  }

  // 觸發click事件時，將done狀態進行取反後，更新存至Storage
  tasksArray[taskIndex].major = !tasksArray[taskIndex].major;
  localStorage.setItem('lists', JSON.stringify(tasksArray));
}



// General Function
function cancelButton() {
  // 移除class，恢復main form原始高度
  main.classList.remove('adding');
  // 隱藏Add Task input下方的new task
  newTask.classList.remove('new_task');
  // 清空form內容
  newTaskForm.reset();
}

function updateTasks(tasksArray, taskList) {
  // ${task.done ? 'checked' : ''} -> 若task.done為true，則加上checked屬性
  // join()將所有模板字串接在一起，全部賦值給itemsLists.innerHTML
  taskList.innerHTML = tasksArray.map((task, index) => {
    return `
      <article class="task">
        <form id="task-edit">
          <section class="task_header">
            <div class="title_group">
              <input type="checkbox" data-done="${index}" class="done_task" id="done-task${index}" ${task.done ? 'checked' : ''}>
              <label for="done-task${index}"><i class="far fa-check"></i></label>
              <textarea name="task title" rows="1" placeholder="Type Something Here...">${task.title}</textarea>
              <div class="marker_group">
                <input type="checkbox" data-major="${index}" class="marker_star" id="marker-star${index}" ${task.major ? 'checked' : ''}>
                <label for="marker-star${index}">
                  <i class="far fa-star general"></i>
                  <i class="fas fa-star major"></i>
                </label>
                <input type="checkbox" data-edit="${index}" class="marker_pen" id="marker-pen${index}" ${task.edit ? 'checked' : ''}>
                <label for="marker-pen${index}">
                  <i class="far fa-pen general"></i>
                  <i class="fas fa-pen edit"></i>
                </label>
              </div>
            </div>
            <div class="info_group">
              <span class=""><i class="far fa-calendar-alt fa-fw"></i>6/18</span>
              <i class="far fa-file fa-fw"></i>
              <i class="far fa-comment-dots fa-fw show"></i>
            </div>
          </section>
          <div class="task_content">
            <section class="task_body">
              <div class="edit_item deadline">
                <label for="date time"><i class="far fa-calendar-alt fa-fw"></i>Deadline</label>
                <div class="edit_content">
                  <input id="date" type="text" placeholder="yyyy/mm/dd" name="deadline-date" value="${task.deadlineDate}">
                  <input id="time" type="text" placeholder="hh:mm" name="deadline-time" value="${task.deadlineTime}">
                </div>
              </div>
              <div class="edit_item file">
                <label for="upload"><i class="far fa-file fa-fw"></i>File</label>
                <div class="edit_content">
                  <input id="upload" type="file" name="file-upload" file="${task.file}>
                  <label for="upload"><i class="fal fa-plus fa-fw"></i></label>
                </div>
              </div>
              <div class="edit_item comment">
                <label for="text"><i class="far fa-comment-dots fa-fw"></i>Comment</label>
                <div class="edit_content">
                  <textarea name="comment" placeholder="Type your memo here…">${task.comment}</textarea>
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


// 自動載入以保存在LocalStorage中的tasks
export default updateTasks(tasksArray, taskList);

// add new task
addTaskButton.addEventListener('focus', addTask);
newTask.addEventListener('reset', cancelTask); // 未新增task的cancel：代表reset表單
newTask.addEventListener('submit', submitAddTask);
// newTask.addEventListener('click', submitAddTask);

// exist tasks
// 既有task的cancel：代表移除整個task，若只是修改內容應該toggle edit icon收合編輯區塊
taskList.addEventListener('click', checkCompletion);
taskList.addEventListener('click', toggleEditArea);
taskList.addEventListener('click', markupTask);