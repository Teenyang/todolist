const main = document.querySelector('main');

// Listener function
function changeDateInputType(event) {
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
    const today = new Date();
    // getMonth()介於0~11
    const uploadDate = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

    const fileData = this.querySelector('.file_data');
    fileData.classList.add('show');
    fileData.innerHTML = `
      <p>${fileName}</p>
      <span>uploaded ${uploadDate}</span>
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