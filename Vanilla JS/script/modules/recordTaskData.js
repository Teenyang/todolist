//* 先以物件形式紀錄task data，再推進tasksDataArray存進localStorage
function recordTaskData(currentTask) {
  const today = Date.now();
  // const filesObject = taskFrom.querySelector('.upload_file').files[0];
  // const objectURL = URL.createObjectURL(filesObject);
  const fileName = currentTask.querySelector('.file_data .upload_fileName').textContent;

  return {
    title: currentTask.querySelector('.task_header .task_title').value,
    done: currentTask.querySelector('.done_checkbox').checked,
    star: currentTask.classList.contains('star'),
    deadlineDate: currentTask.querySelector('.task_body .deadline_date').value,
    deadlineTime: currentTask.querySelector('.task_body .deadline_time').value,
    // fileObjectURL: objectURL,
    file: fileName,
    fileUpload: fileName ? `${today}` : '',
    // fileUploadDate: ,
    comment: currentTask.querySelector('.task_body .edit_comment').value,
  }
}

export default recordTaskData;