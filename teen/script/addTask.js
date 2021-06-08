const main = document.querySelector('main');
const addTaskForm = document.querySelector('#add-task-form');

const container = document.querySelector('.container');
const taskList = document.querySelector('.task_list');

function addTask(event) {
  // 增加class，讓Add Task <input>高度變成 0
  main.classList.add('adding');

  // 每次點擊Add Task <input>便會產生task區塊及classLsit，並將此附加在Add Task <input>之後、taskList之前
  const task = document.createElement('article');
  task.className = "task editing";
  container.insertBefore(task, taskList);

  task.innerHTML = `
      <section class="task_header">
        <form id="task-title">
          <input type="checkbox" class="add_task" id="add-task">
          <label for="add-task"><i class="far fa-check"></i></label>
          <textarea name="task title" rows="1" placeholder="Type Something Here..."></textarea>
          <div class="marker_group">
            <button type="button" class="marker_star"><i class="far fa-star"></i></button>
            <button type="button" class="marker_major"><i class="fas fa-star"></i></button>
            <button type="button" class="marker_pen"><i class="far fa-pen"></i></button>
            <button type="button" class="marker_edit"><i class="fas fa-pen"></i></button>
          </div>
        </form>
        <div class="info_group">
          <span class=""><i class="far fa-calendar-alt fa-fw"></i>6/18</span>
          <i class="far fa-file fa-fw"></i>
          <i class="far fa-comment-dots fa-fw show"></i>
        </div>
      </section>
      <div class="task_content">
        <section class="task_body">
          <form id="task-edit">
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
          </form>
        </section>
        <section class="task_footer">
          <button type="reset" class="task_cancel"><i class="fal fa-times"></i>Cancel</button>
          <button type="submit" class="task_editing"><i class="fal fa-plus"></i>Add Task</button>
        </section>
      </div>
  `

  // task提交按鈕的submit事件
  const submitAddTask = document.querySelector('.task_footer button[type="submit"]');
  // submitAddTask.addEventListener('click', submitTask);
  submitAddTask.addEventListener('click', (event) => {
    event.preventDefault();

    // 清空Add Task <input>內容
    addTaskForm.querySelector('input').value = '';

    // 讓新增的task永遠在既有task的上方
    if (!taskList.hasChildNodes()) {
      taskList.appendChild(task);
    }
    else {
      // 搜尋到既有tasks中的第一個task作為參考點，在其之前放入新增的task
      const topTask = taskList.querySelector('article');
      taskList.insertBefore(task, topTask);
    }

    // 恢復Add Task <input>高度
    main.classList.remove('adding');
    // 關閉task的編輯區域
    task.classList.remove('editing');
  });
}

// export default
addTaskForm.addEventListener('click', addTask);