// DEBUG
console.log('popup.js');

function showPopupPage(d) {
  document.getElementById('name').innerText = d.name;
  document.getElementById('no').innerText = d.no;
  document.getElementById('last-update-time').innerText = d.lastUpdateTime;
  document.getElementById('work-day').innerText = d.workedDays;
  document.getElementById('avg-hour').innerText = d.avgHour;
  document.getElementById('avg-quarter-hour').innerText = d.avgQuarterHour;
  document.getElementById('avg-last-quarter-hour').innerText = d.avgLastQuarterHour;
}

chrome.storage.sync.get(null, showPopupPage);