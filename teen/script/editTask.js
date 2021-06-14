const main = document.querySelector('main');
console.log(main);


function changeDate(event) {
  if (event.target.className === 'deadline_date') {
    event.target.type = 'date';
  }
  else if (event.target.className === 'deadline_time') {
    event.target.type = 'time';
  }
}

function uploadFile(event) {
  if (event.target.className === 'upload_file') {
    const fileName = event.target.files[0].name;

    const todayMillisecond = Date.now();
    const uploadMillisecond = todayMillisecond;
    const fileUpload = compareDate(todayMillisecond, uploadMillisecond);

    const fileData = this.querySelector('.file_data');
    fileData.classList.add('show');
    fileData.innerHTML = `
      <p>${fileName}</p>
      <span>uploaded ${fileUpload}</span>
    `
  }
}

function editComment(event) {
  if (event.target.className === 'edit_comment') {
    event.target.removeAttribute('readonly');
  }

  event.target.addEventListener('blur', () => {
    event.target.setAttribute('readonly', '');
  })
}

main.addEventListener('click', changeDate);
main.addEventListener('change', uploadFile);
main.addEventListener('dblclick', editComment);

export { changeDate, uploadFile, editComment };