// MAIN：Add Task
const main = document.querySelector('main');

// taskList：exist tasks
const taskList = document.querySelector('.task_list');

// JSON.parse：將字串轉回原本陣列格式
// 初始值為空陣列，或者若Storage已有紀錄則呈現先前保留的資料
// If the key of getItem() doesn't exist, null is returned. => null為falsy值
const tasksArray = JSON.parse(localStorage.getItem('lists')) || [];


function compareDaysAgo(date) {
  const today = new Date();
  const compareDate = new Date(Number(date));
  const dateYear = compareDate.getFullYear();
  const dateMonth = compareDate.getMonth() + 1;  // getMonth()介於0~11，月份值由0起算
  const dateDate = compareDate.getDate();

  const dayMilliseconds = 24 * 60 * 60 * 1000;
  const passDays = Math.floor((today - date) / dayMilliseconds);

  if (dateYear === today.getFullYear() || dateMonth === today.getMonth() + 1 || dateDate === today.getDate()) {
    return `today`;
  }
  else {
    return `${(1 <= passDays && passDays < 2) ? 'yesterday' : (passDays + 'days ago')} `
  }
}

function dateSlashFormat(date) {
  const dateSlash = new Date(Number(date));
  return `${dateSlash.getFullYear()}/${dateSlash.getMonth() + 1}/${dateSlash.getDate()}`;
}

function calendarSlashFormat(deadline) {
  // 取開頭四個數字
  const year = Number(deadline.match(/^\d{4}/g));
  // 取開頭為中線（但不包含）之後的兩個數字，且數字後為中線
  const month = Number(deadline.match(/(?<=([-]))\d{2}(?=[-])/g));
  // 取倒數兩個數字
  const date = Number(deadline.match(/\d{2}$/g));

  // 同年不須顯示年份，去年之前則顯示完整年月日
  return `${(year === new Date().getFullYear()) ? '' : year + '/'} ${month} /${date}`
}

function recordTaskData(taskArticle) {
  const today = Date.now();
  const fileName = taskArticle.querySelector('.file_data .upload_fileName').textContent;
  const uploadDateMillisecond = fileName ? `${today}` : '';

  return {
    title: taskArticle.querySelector('.task_header textarea').value,
    done: taskArticle.querySelector('.done_task').checked,
    major: taskArticle.querySelector('.marker_star').checked,
    deadlineDate: taskArticle.querySelector('.task_body #date').value,
    deadlineTime: taskArticle.querySelector('.task_body #time').value,
    file: fileName,
    fileUpload: uploadDateMillisecond,
    comment: taskArticle.querySelector('.task_body textarea').value,
  }
}

function updateTaskData(tasksArray, taskList) {
  // join()將所有模板字串接在一起，全部賦值給itemsLists.innerHTML
  taskList.innerHTML = tasksArray.map((task, index) => {
    return `
      <article data-task="${index}" class="task ${task.done ? 'completed' : ''} ${task.major ? 'major' : ''} ${(task.deadlineDate !== '') || (task.file !== '') || (task.comment !== '') ? 'progress' : ''}">
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
              <span class="${(task.deadlineDate !== '') ? 'show' : ''}"><i class="far fa-calendar-alt"></i>${(task.deadlineDate !== '') ? calendarSlashFormat(task.deadlineDate) : ''}</span>
              <i class="${(task.file !== '') ? 'show' : ''} far fa-file"></i>
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
                  <div class="file_data">
                    <span class="upload_fileName">${(task.file !== '') ? task.file : ''}</span>
                    <p class="upload_daysAgo">${(task.file !== '') ? 'uploaded ' + compareDaysAgo(task.fileUpload) : ''}
                      (<span class="upload_dateSlash">${(task.file !== '') ? dateSlashFormat(task.fileUpload) : ''}</span>)
                    </p>
                    <span class="upload_dateMillisecond">${(task.file !== '') ? task.fileUpload : ''}</span>
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

function setLocalStorage(storageArray) {
  localStorage.setItem('lists', JSON.stringify(storageArray));
}

export { main, taskList, tasksArray, compareDaysAgo, dateSlashFormat, recordTaskData, updateTaskData, setLocalStorage };