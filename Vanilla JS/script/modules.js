const main = document.querySelector('main');
const addTaskButton = main.querySelector('.add_button');
const newTask = main.querySelector('main > .task');
const taskList = document.querySelector('.task_list');
//* JSON.parse()：將字串轉回原本陣列格式
//* If the key of getItem() doesn't exist, null is returned. => null為falsy值
//* 初始值為空陣列，若Storage已有紀錄則從先前保留資料getItem()
const tasksArray = JSON.parse(localStorage.getItem('lists')) || [];


//! 展開編輯區塊時，將專注在編輯該任務，其他任務則先消失，待任務被cancel或save後才恢復顯示所有任務清單
function focusEditCurrentTask(taskIndex) {
  const tasks = main.querySelectorAll('.task');
  tasks.forEach((task, index) => {
    if (index !== taskIndex) {
      task.style.display = 'none';
    }
  })
  tasks[taskIndex].style.display = 'block';

  addTaskButton.classList.add('hide_button');
}

//! 提交表單後恢復顯示所有任務清單
function doneEditCurrentTask() {
  const tasks = main.querySelectorAll('.task');
  tasks.forEach(task => task.style.display = 'block');

  addTaskButton.classList.remove('hide_button');
}

function sortTaskOrder(currentTask, currentTaskData) {
  //* all task
  const allTasksInList = taskList.querySelectorAll('.task');
  const allTasksInListCount = allTasksInList.length;
  //* completed task
  const allCompletedTasksCount = taskList.querySelectorAll('.task.completed').length;
  const majorCompletedTaskStartIndex = allTasksInListCount - allCompletedTasksCount;
  const majorCompletedTasksCount = taskList.querySelectorAll('.task.completed.major').length;
  const otherCompletedTaskStartIndex = majorCompletedTaskStartIndex + majorCompletedTasksCount;
  //* major task
  const majorTaskStartIndex = 0;
  const majorTasksCount = taskList.querySelectorAll('.task.major').length - majorCompletedTasksCount;
  //* general task
  const generalTasksStartIndex = majorTasksCount;

  if (currentTask.classList.contains('major') && currentTask.classList.contains('completed')) {
    //* done V , star V：下移(已是major，後再done)、上移(已是done，後再major)
    tasksArray.splice(majorCompletedTaskStartIndex, 0, currentTaskData);
  }
  else if (currentTask.classList.contains('major')) {
    //* done X , star V：上移(最後major)
    tasksArray.splice(majorTaskStartIndex, 0, currentTaskData);
  }
  else if (currentTask.classList.contains('completed')) {
    //* done V , star X：下移(最後done)
    tasksArray.splice(otherCompletedTaskStartIndex, 0, currentTaskData);
  }
  else {
    //* done X , star X：下移(不是done，後再移除major)、上移(不是major，後再移除done)
    tasksArray.splice(generalTasksStartIndex, 0, currentTaskData);
  }
}

function compareDaysAgo(date) {
  const today = new Date();
  const compareDate = new Date(Number(date));
  const dateYear = compareDate.getFullYear();
  //* getMonth()介於0~11，月份值由0起算
  const dateMonth = compareDate.getMonth() + 1;
  const dateDate = compareDate.getDate();

  const dayMilliseconds = 24 * 60 * 60 * 1000;
  //* 日期不同代表已跨隔日，使用Math.ceil()無條件進位取最大整數
  const passDays = Math.ceil((today - date) / dayMilliseconds);

  if (dateYear === today.getFullYear() && dateMonth === today.getMonth() + 1 && dateDate === today.getDate()) {
    return `today`;
  }
  else {
    return `${(passDays <= 1) ? 'yesterday' : (passDays + 'days ago')} `
  }
}

function convertDateStringToSlashFormat(date) {
  const dateSlash = new Date(Number(date));
  return `${dateSlash.getFullYear()}/${dateSlash.getMonth() + 1}/${dateSlash.getDate()}`;
}

function captureDeadlineSlashFormat(deadline) {
  const year = Number(deadline.match(/^\d{4}/g));
  const month = Number(deadline.match(/(?<=([-]))\d{2}(?=[-])/g));
  const date = Number(deadline.match(/\d{2}$/g));

  //* 同年不須顯示年份，去年之前則顯示完整年月日
  return `${(year === new Date().getFullYear()) ? '' : year + '/'}${month}/${date}`;
}

//* 先以物件形式紀錄task data，再推進tasksArray存進localStorage
function recordTaskData(taskArticle) {
  const today = Date.now();
  const filesObject = taskArticle.querySelector('.upload_file').files[0];
  const objectURL = URL.createObjectURL(filesObject);
  const fileName = taskArticle.querySelector('.file_data .upload_fileName').textContent;
  const uploadDateMillisecond = fileName ? `${today}` : '';

  return {
    title: taskArticle.querySelector('.task_header .task_title').value,
    done: taskArticle.querySelector('.done_task').checked,
    major: taskArticle.querySelector('.major_task').checked,
    deadlineDate: taskArticle.querySelector('.task_body #date').value,
    deadlineTime: taskArticle.querySelector('.task_body #time').value,
    fileObjectURL: objectURL,
    file: fileName,
    fileUpload: uploadDateMillisecond,
    comment: taskArticle.querySelector('.task_body .edit_comment').value,
  }
}

//* 將存進localStorage的task data透過array.map()更新至taskList區域，逐一匯出task內容
function exportTaskDataFromLocalStorage(tasksArray, taskList) {
  taskList.innerHTML = tasksArray.map((task, index) => {
    return `
      <article data-task="${index}" class="task ${task.done ? 'completed' : ''} ${task.major ? 'major' : ''} ${(task.deadlineDate !== '') || (task.file !== '') || (task.comment !== '') ? 'progress' : ''} drag">
        <form data-form="${index}" id="task-edit" autocomplete="off" name="task-list">
          <section class="task_header">
            <div class="title_group">
              <input type="checkbox" data-done="${index}" data-index="${index}" class="done_task" id="doneTask${index}" ${task.done ? 'checked' : ''}>
              <label for="doneTask${index}"><i class="far fa-check"></i></label>
              <input data-title="${index}" type="text" class="task_title" name="task-title" placeholder="Type Something Here..." required value="${task.title}">
              <div class="marker_group">
                <input type="checkbox" data-major="${index}" data-index="${index}" class="major_task" id="markerStar${index}" ${task.major ? 'checked' : ''}>
                <label for="markerStar${index}">
                  <i class="far fa-star general"></i>
                  <i class="fas fa-star major"></i>
                </label>
                <input type="checkbox" data-edit="${index}" class="edit_task" id="markerPen${index}">
                <label for="markerPen${index}">
                  <i class="far fa-pen general"></i>
                  <i class="fas fa-pen edit"></i>
                </label>
                <i data-delete="${index}" class="far fa-trash-alt general delete_task"></i>
              </div>
            </div>
            <div class="info_group">
              <span class="${(task.deadlineDate !== '') ? 'show' : ''}"><i class="far fa-calendar-alt"></i>${(task.deadlineDate !== '') ? captureDeadlineSlashFormat(task.deadlineDate) : ''}</span>
              <i class="${(task.file !== '') ? 'show' : ''} far fa-file"></i>
              <i class="${(task.comment !== '') ? 'show' : ''} far fa-comment-dots"></i>
            </div>
          </section>
          <div class="task_content">
            <section class="task_body">
              <div class="edit_item deadline">
                <label><i class="far fa-calendar-alt fa-fw edit_icon"></i>Deadline</label>
                <div class="edit_content">
                  <input id="date" type="text" class="deadline_date" placeholder="yyyy/mm/dd" name="deadline-date" value="${task.deadlineDate}">
                  <input id="time" type="text" class="deadline_time" placeholder="hh:mm" name="deadline-time" value="${task.deadlineTime}">
                </div>
              </div>
              <div class="edit_item file">
                <label><i class="far fa-file fa-fw edit_icon"></i>File</label>
                <div class="edit_content">
                  <div class="file_data ${(task.file !== '') ? 'show' : ''}">
                    <a href="${(task.file !== '') ? task.fileObjectURL : ''}" class="download_file" download="new_${(task.file !== '') ? task.file : ''}">
                      <span class="upload_fileName">${(task.file !== '') ? task.file : ''}</span>
                    </a>
                    <p class="upload_days_ago">${(task.file !== '') ? 'uploaded ' + compareDaysAgo(task.fileUpload) : ''}
                      (<span class="upload_dateSlash">${(task.file !== '') ? convertDateStringToSlashFormat(task.fileUpload) : ''}</span>)
                    </p>
                    <span class="upload_dateMillisecond">${(task.file !== '') ? task.fileUpload : ''}</span>
                  </div>
                  <input data-upload="${index}" id="upload${index}" type="file" class="upload_file" name="file-upload" value="${task.file}">
                  <label for="upload${index}"><i class="fal fa-plus fa-fw"></i></label>
                </div>
              </div>
              <div class="edit_item comment">
                <label><i class="far fa-comment-dots fa-fw edit_icon"></i>Comment</label>
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
  //* 儲存後的submit button文字直接改成“Save”
}

//* JSON.stringify：將陣列格式轉成字串以便讀取
//* 透過setItem()將tasksArray儲存在localStorage
function setLocalStorage(storageArray) {
  localStorage.setItem('lists', JSON.stringify(storageArray));
}

export { main, addTaskButton, newTask, taskList, tasksArray, focusEditCurrentTask, doneEditCurrentTask, sortTaskOrder, compareDaysAgo, convertDateStringToSlashFormat, recordTaskData, exportTaskDataFromLocalStorage, setLocalStorage };