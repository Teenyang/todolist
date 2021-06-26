import { compareDaysAgo, separateDateFormatWithSlash, captureDeadlineCalendarFormat } from '../modules/convertDateFormat.js'

const main = document.querySelector('main');
const taskList = document.querySelector('.task_list');

function renderNewTask() {
  const newTask = document.createElement('form');
  main.insertBefore(newTask, taskList);

  newTask.outerHTML = `
    <form id="task-edit" class="task new_task editing" autocomplete="off" name="task-list">
      <section class="task_header">
        <div class="title_group">
          <input type="checkbox" class="done_task" id="doneTask">
          <label for="doneTask"><i class="far fa-check"></i></label>
          <input type="text" class="task_title" name="task-title" placeholder="Type Something Here..." required>
          <div class="marker_group">
            <i class="far fa-star star_task general_icon"></i>
            <i class="fas fa-star star_task star_icon"></i>
            <i class="far fa-pen edit_task general_icon"></i>
            <i class="fas fa-pen edit_task pen_icon"></i>
          </div>
        </div>
      </section>
      <div class="task_content">
        <section class="task_body">
          <div class="edit_item deadline">
            <label><i class="far fa-calendar-alt fa-fw edit_icon"></i>Deadline</label>
            <div class="edit_content">
              <input id="date" type="text" class="deadline_date" placeholder="yyyy/mm/dd" name="deadline-date">
              <input id="time" type="text" class="deadline_time" placeholder="hh:mm" name="deadline-time">
            </div>
          </div>
          <div class="edit_item file">
            <label><i class="far fa-file fa-fw edit_icon"></i>File</label>
            <div class="edit_content">
              <div class="file_data">
                <!-- <a class="download_file"> -->
                <span class="upload_fileName"></span>
                <!-- </a> -->
                <p class="upload_days_ago">
                  <span class="upload_dateSlash"></span>
                </p>
                <span class="upload_dateMillisecond"></span>
              </div>
              <input id="upload" type="file" class="upload_file" name="file-upload">
              <label for="upload"><i class="fal fa-plus fa-fw"></i></label>
            </div>
          </div>
          <div class="edit_item comment">
            <label><i class="far fa-comment-dots fa-fw edit_icon"></i>Comment</label>
            <div class="edit_content">
              <textarea class="edit_comment" name="comment" placeholder="Type your memo here…" readonly></textarea>
            </div>
          </div>
        </section>
        <section class="task_footer">
          <button type="reset" class="task_cancel"><i class="fal fa-times"></i>Cancel</button>
          <button type="submit" class="task_editing"><i class="fal fa-plus"></i>Add Task</button>
        </section>
      </div>
    </form>
  `
}


//* 將存進localStorage的task data透過array.map()更新至taskList區域，逐一匯出task內容
// function renderTaskList(tasksDataArray, taskList) {
function renderTaskList() {
  const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];
  taskList.innerHTML = tasksDataArray.map((task, index) => {
    return `
      <form data-index="${index}" id="task-edit" autocomplete="off" name="task-list" class="task ${task.done ? 'completed' : ''} ${task.star ? 'star' : ''} ${(task.deadlineDate !== '') || (task.file !== '') || (task.comment !== '') ? 'progress' : ''} drag">
        <section class="task_header">
          <div class="title_group">
            <input type="checkbox" class="done_task" id="doneTask${index}" ${task.done ? 'checked' : ''}>
            <label for="doneTask${index}"><i class="far fa-check"></i></label>
            <input type="text" class="task_title" name="task-title" placeholder="Type Something Here..." required value="${task.title}">
            <div class="marker_group">
              <i class="far fa-star star_task general_icon"></i>
              <i class="fas fa-star star_task star_icon"></i>
              <i class="far fa-pen edit_task general_icon"></i>
              <i class="fas fa-pen edit_task pen_icon"></i>
              <i class="far fa-trash-alt delete_task general_icon"></i>
            </div>
          </div>
          <div class="info_group">
            <span class="${(task.deadlineDate !== '') ? 'show' : ''}"><i class="far fa-calendar-alt"></i>${(task.deadlineDate !== '') ? captureDeadlineCalendarFormat(task.deadlineDate) : ''}</span>
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
                  <span class="upload_fileName">${(task.file !== '') ? task.file : ''}</span>
                  <p class="upload_days_ago">${(task.file !== '') ? 'uploaded ' + compareDaysAgo(task.fileUpload) : ''}
                    (<span class="upload_dateSlash">${(task.file !== '') ? separateDateFormatWithSlash(task.fileUpload) : ''}</span>)
                  </p>
                  <span class="upload_dateMillisecond">${(task.file !== '') ? task.fileUpload : ''}</span>
                </div>
                <input id="upload${index}" type="file" class="upload_file" name="file-upload" value="${task.file}">
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
    `
  }).join('');
  //* 儲存後的submit button文字直接改成“Save”
}

function saveToLocalStorage(storageArray) {
  localStorage.setItem('lists', JSON.stringify(storageArray));
}


const clearStorageButton = document.querySelector('.clear_local_storage');
function DeleteLocalStorage() {
  localStorage.clear();
  renderTaskList();
}
clearStorageButton.addEventListener('click', DeleteLocalStorage);

export { renderNewTask, renderTaskList, saveToLocalStorage, DeleteLocalStorage }