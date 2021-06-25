
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

function separateDateFormatWithSlash(date, spacer = '/') {
  const dateSlash = new Date(Number(date));
  return `${dateSlash.getFullYear()}${spacer}${dateSlash.getMonth() + 1}${spacer}${dateSlash.getDate()}`;
}

function captureDeadlineCalendarFormat(deadline) {
  const year = Number(deadline.match(/^\d{4}/g));
  const month = Number(deadline.match(/(?<=([-]))\d{2}(?=[-])/g));
  const date = Number(deadline.match(/\d{2}$/g));

  //* 同年不須顯示年份，去年之前則顯示完整年月日
  return `${(year === new Date().getFullYear()) ? '' : year + '/'}${month}/${date}`;
}

export { compareDaysAgo, separateDateFormatWithSlash, captureDeadlineCalendarFormat }