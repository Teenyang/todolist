import { compareDaysAgo, separateDateFormatWithSlash, captureDeadlineCalendarFormat } from '../modules/convertDateFormat.js'

//* 將存進localStorage的task data透過array.map()更新至taskList區域，逐一匯出task內容
// function renderTaskList(tasksDataArray, taskList) {
function renderTaskList() {
  const taskList = document.querySelector('.task_list');
  const tasksDataArray = JSON.parse(localStorage.getItem('lists')) || [];

  taskList.innerHTML = tasksDataArray.map((task, index) => {
    return `
      <form data-index="${index}" id="task-edit" autocomplete="off" name="task-list" class="task ${task.done ? 'completed' : ''} ${task.major ? 'major' : ''} ${(task.deadlineDate !== '') || (task.file !== '') || (task.comment !== '') ? 'progress' : ''} drag">
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

export { renderTaskList, saveToLocalStorage, DeleteLocalStorage }