const main = document.querySelector('main');
const infoGroups = main.querySelectorAll('.info_group');

function changeDateInputType(event) {
  if (event.target.className === 'deadline_date') {
    event.target.type = 'date';

    // const dateIndex = event.target.dataset.date;

    // infoGroups.forEach(infoGroup => {
    //   const infoIndex = infoGroup.dataset.info;
    //   event.target.classList.toggle('show', infoIndex === dateIndex)
    // })
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

main.addEventListener('click', changeDateInputType);
main.addEventListener('change', uploadFile);
main.addEventListener('dblclick', editComment);

export { changeDateInputType, uploadFile, editComment };