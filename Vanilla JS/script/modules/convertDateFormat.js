
function compareDaysAgo(date) {
  //* getMonth()介於0~11，月份值由0起算
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  const compareDay = new Date(Number(date));
  const compareDayYear = compareDay.getFullYear();
  const compareDayMonth = compareDay.getMonth() + 1;
  const compareDayDate = compareDay.getDate();

  const dayMilliseconds = 24 * 60 * 60 * 1000;
  //* 日期不同代表已跨隔日，使用Math.ceil()無條件進位取最大整數
  const passDays = Math.ceil((today - date) / dayMilliseconds);

  if (compareDayYear === todayYear
    && compareDayMonth === todayMonth
    && compareDayDate === todayDate) {
    return `today`;
  }
  else {
    return `${(passDays <= 1) ? 'yesterday' : (passDays + 'days ago')} `
  }
}

function separateDateFormatWithSlash(date, spacer = '/') {
  const day = new Date(Number(date));
  const dayYear = day.getFullYear();
  const dayMonth = day.getMonth() + 1;
  const dayDate = day.getDate();
  return `${dayYear}${spacer}${dayMonth}${spacer}${dayDate}`;
}

function captureCalendarFormat(date) {
  const year = Number(date.match(/^\d{4}/g));
  const month = Number(date.match(/(?<=([-]))\d{2}(?=[-])/g));
  const day = Number(date.match(/\d{2}$/g));
  const thisYear = new Date().getFullYear();

  //* 同年不須顯示年份，去年之前則顯示完整年月日
  return `${(year === thisYear) ? '' : year + '/'}${month}/${day}`;
}

export { compareDaysAgo, separateDateFormatWithSlash, captureCalendarFormat }