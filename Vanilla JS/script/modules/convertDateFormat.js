
function compareDaysAgo(date) {
  //* getMonth()介於0~11，月份值由0起算
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  //* 擷取日期部分
  const compareDayString = new Date(Number(date)).toLocaleDateString();
  //* 日期歸零：取得該日期的0:00:00
  const compareDayZeroAM = new Date(compareDayString);
  const compareDayYear = compareDayZeroAM.getFullYear();
  const compareDayMonth = compareDayZeroAM.getMonth() + 1;
  const compareDayDate = compareDayZeroAM.getDate();

  //* 以同型別(日期物件)運算相減獲得number結果
  //* 日期不同代表已跨隔日，使用Math.floor()無條件捨去取最小整數
  const dayMilliseconds = 24 * 60 * 60 * 1000;
  const passDays = Math.floor((today - compareDayZeroAM) / dayMilliseconds);

  //   //todo else-if寫完整！
  if (compareDayYear === todayYear
    && compareDayMonth === todayMonth
    && compareDayDate === todayDate) {
    return `today`;
  }
  else if (passDays <= 1) {
    return `yesterday`;
  }
  else {
    return `${passDays} days ago`;
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