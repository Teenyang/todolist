const main = document.querySelector('main');
const addTaskInput = document.querySelector('#add-task-form input');
const container = document.querySelector('.container');
const taskList = document.querySelector('.task_list');
const task = document.createElement('article');

// JSON.parse：將字串轉回原本陣列格式
// 初始值為空陣列，或者若Storage已有紀錄則呈現先前保留的資料
// If the key of getItem() doesn't exist, null is returned. => null為falsy值
const tasksArray = JSON.parse(localStorage.getItem('lists')) || [];


function addTask() {
  // focus Add Task input：增加class，main form高度變成0
  main.classList.add('adding');

  // focus Add Task input：創建task，並附加在main之後、taskList之前
  task.className = "task editing";
  container.insertBefore(task, taskList);
  createNewTask(task);

  // form：task_header's title & task_body's edit
  const taskForms = task.querySelectorAll('form');
  const taskEditForm = task.querySelector('#task-edit');
  // task reset button
  taskEditForm.addEventListener('reset', () => resetTaskContent(taskForms));
  // task submit button
  taskEditForm.addEventListener('submit', submitAddTask);
}

function createNewTask(task) {
  task.innerHTML = `
      <section class="task_header">
        <form id="task-title">
          <input type="checkbox" class="done_task" id="done-task">
          <label for="done-task"><i class="far fa-check"></i></label>
          <textarea name="task title" rows="1" placeholder="Type Something Here..."></textarea>
          <div class="marker_group">
            <input type="checkbox" class="marker_star" id="marker-star">
            <label for="marker-star">
              <i class="far fa-star general"></i>
              <i class="fas fa-star major"></i>
            </label>
            <input type="checkbox" class="marker_pen" id="marker-pen">
            <label for="marker-pen">
              <i class="far fa-pen general"></i>
              <i class="fas fa-pen edit"></i>
            </label>
          </div>
        </form>
        <div class="info_group">
          <span class=""><i class="far fa-calendar-alt fa-fw"></i>6/18</span>
          <i class="far fa-file fa-fw"></i>
          <i class="far fa-comment-dots fa-fw show"></i>
        </div>
      </section>
      <form id="task-edit">
        <section class="task_body">
          <div class="edit_item deadline">
            <label for="date time"><i class="far fa-calendar-alt fa-fw"></i>Deadline</label>
            <div class="edit_content">
              <input id="date" type="text" placeholder="yyyy/mm/dd" name="deadline-date">
              <input id="time" type="text" placeholder="hh:mm" name="deadline-time">
            </div>
          </div>
          <div class="edit_item file">
            <label for="upload"><i class="far fa-file fa-fw"></i>File</label>
            <div class="edit_content">
              <input id="upload" type="file" name="file-upload">
              <label for="upload"><i class="fal fa-plus fa-fw"></i></label>
            </div>
          </div>
          <div class="edit_item comment">
            <label for="text"><i class="far fa-comment-dots fa-fw"></i>Comment</label>
            <div class="edit_content">
              <textarea name="comment" placeholder="Type your memo here…"></textarea>
            </div>
          </div>
        </section>
        <section class="task_footer">
          <button type="reset" class="task_cancel"><i class="fal fa-times"></i>Cancel</button>
          <button type="submit" class="task_editing"><i class="fal fa-plus"></i>Add Task</button>
        </section>
      </form>
  `
  return task;
}

function resetTaskContent(taskForms) {
  taskForms.forEach(taskForm => taskForm.reset())
}

function submitAddTask(event) {
  // 阻止<form>預設的提交行為
  event.preventDefault();

  // task data以物件形式紀錄後再推進tasksArray中
  const eachTask = {
    title: document.querySelector('.task_header textarea').value,
    done: false,
    major: false,
    edit: false,
    deadlineDate: document.querySelector('.task_body #date').value,
    deadlineTime: document.querySelector('.task_body #time').value,
    file: document.querySelector('.task_body #upload').files,
    comment: document.querySelector('.task_body textarea').value,
  }

  // 新增的task永遠在最上方：從（第1個參數）index 0位置開始，刪除（第2個參數）0個元素，並插入eachTask
  tasksArray.splice(0, 0, eachTask);

  // 將tasksArray更新至taskList區域中
  updateTasks(tasksArray, taskList);

  // 將tasksArray更新儲存在Storage，並用JSON.stringify將陣列格式轉成字串以便讀取
  localStorage.setItem('lists', JSON.stringify(tasksArray));

  // 恢復Add Task input高度
  main.classList.remove('adding');

  // 因新增的Task只需將edit form的data存在localStorage中，所以表單submit後，將task node移除；
  // 而每次點擊Add Task都會重新insert task node，故最後省略edit form的reset()清空內容的設定
  task.remove();
}

function updateTasks(tasksArray, taskList) {
  // ${task.done ? 'checked' : ''} -> 若task.done為true，則加上checked屬性
  // join()將所有模板字串接在一起，全部賦值給itemsLists.innerHTML
  taskList.innerHTML = tasksArray.map((task, index) => {
    return `
  <article class="task">
    <section class="task_header">
      <form id="task-title">
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
      </form>
      <div class="info_group">
        <span class=""><i class="far fa-calendar-alt fa-fw"></i>6/18</span>
        <i class="far fa-file fa-fw"></i>
        <i class="far fa-comment-dots fa-fw show"></i>
      </div>
    </section>
    <form id="task-edit">
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
        <button type="reset" class="task_cancel"><i class="fal fa-times"></i>Cancel</button>
        <button type="submit" class="task_editing"><i class="fal fa-plus"></i>Save</button>
      </section>
    </form>
  </article>
  `
  }).join('');
  // 儲存後的submit button文字變成“Save”
}

function checkCompletion(event) {
  // done
  if (event.target.className === 'done_task') {
    const checkInput = event.target;
    const checkStatus = checkInput.checked;
    const taskIndex = checkInput.dataset.done;

    // 依checked狀態增刪class
    if (checkStatus) {
      this.querySelectorAll('.task')[taskIndex].classList.add('completed');
    }
    else {
      this.querySelectorAll('.task')[taskIndex].classList.remove('completed');
    }

    // 觸發click事件時，將done狀態進行取反後，更新存至Storage
    tasksArray[taskIndex].done = !tasksArray[taskIndex].done;
    localStorage.setItem('lists', JSON.stringify(tasksArray));
  }

}

function toggleEditArea(event) {
  // Element.matches(selectorString)：若元素不相符則結束函式
  // if (!event.target.matches('button')) {
  //   return;
  // }

  console.log(event.target);

}


// 自動載入以保存在LocalStorage中的tasks
export default updateTasks(tasksArray, taskList);

addTaskInput.addEventListener('focus', addTask);
taskList.addEventListener('click', checkCompletion);
taskList.addEventListener('click', toggleEditArea);