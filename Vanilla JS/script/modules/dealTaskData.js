//* 先以物件形式紀錄task data，再推進tasksDataArray存進localStorage
function recordTaskData(taskFrom) {
  const today = Date.now();
  // const filesObject = taskFrom.querySelector('.upload_file').files[0];
  // const objectURL = URL.createObjectURL(filesObject);
  const fileName = taskFrom.querySelector('.file_data .upload_fileName').textContent;
  const uploadDateMillisecond = fileName ? `${today}` : '';

  return {
    title: taskFrom.querySelector('.task_header .task_title').value,
    done: taskFrom.querySelector('.done_task').checked,
    major: taskFrom.querySelector('.major_task').checked,
    deadlineDate: taskFrom.querySelector('.task_body #date').value,
    deadlineTime: taskFrom.querySelector('.task_body #time').value,
    // fileObjectURL: objectURL,
    file: fileName,
    fileUpload: uploadDateMillisecond,
    comment: taskFrom.querySelector('.task_body .edit_comment').value,
  }
}

export default recordTaskData;