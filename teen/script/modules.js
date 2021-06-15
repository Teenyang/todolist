// MAIN：Add Task
const main = document.querySelector('main');

// taskList：exist tasks
const taskList = document.querySelector('.task_list');

// JSON.parse：將字串轉回原本陣列格式
// 初始值為空陣列，或者若Storage已有紀錄則呈現先前保留的資料
// If the key of getItem() doesn't exist, null is returned. => null為falsy值
const tasksArray = JSON.parse(localStorage.getItem('lists')) || [];


function fillZero(number) {
  return (number < 10) ? `0${number} ` : `${number}`;
}

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

function updateTaskData(tasksArray, taskList) {
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
                    <span>${(task.file.length > 0) ? 'uploaded' + task.fileUpload : ''}</span>
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
  localStorage.setItem('lists', JSON.stringify(tasksArray));
}


export { main, taskList, tasksArray, recordTaskData, updateTaskData, setLocalStorage };

// function daysCountdown(uploadMs) {
// }
// setInterval(daysCountdown, 86400);