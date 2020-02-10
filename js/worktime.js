/*
 * Scraping https://tuhu.peoplus.cn/web page.
 */
const interval = setInterval(() => {
  const isRightHashPage = document.title.includes('考勤明细'); // 解决hash模式加载问题
  let data = document.getElementsByTagName('tbody')[0];
  if (isRightHashPage && data && data.getElementsByTagName('tr')[0].querySelector('td[data-field="title"]')) {
    clearInterval(interval);
    const d = new Date();
    const curMonth = `${d.getFullYear()}-${fillPreZero(d.getMonth() + 1)}`;
    const [lastQuarter, curQuarter] = getQuarterByMonth(d.getMonth());
    let name, no, workedDays = 0, workedHours = 0, quarterDays = 0, quarterHours = 0, lastQuarterDays = 0, lastQuarterHours = 0;
    const lastUpdateTime = `${curMonth}-${fillPreZero(d.getDate())} ${fillPreZero(d.getHours())}:${fillPreZero(d.getMinutes())}`;

    data = data.getElementsByTagName('tr');
    name = data[0].querySelector('td[data-field="employee_name"]').innerText;
    no = data[0].querySelector('td[data-field="employee_number"]').innerText;
    [...data].forEach(item => {
      const workDate = item.querySelector('td[data-field="title"]').innerText;
      const workMonth = workDate.substr(0, 7);
      const startTime = item.querySelector('td[data-field="clock_in_time"]').innerText;
      const endTime = item.querySelector('td[data-field="clock_out_time"]').innerText;

      if (curMonth === workMonth) {
        workedDays++;
        workedHours += getWorkedHours(startTime, endTime);
      }

      if (curQuarter.includes(workMonth)) {
        quarterDays++;
        quarterHours += getWorkedHours(startTime, endTime);
      }

      if (lastQuarter.includes(workMonth)) {
        lastQuarterDays++;
        lastQuarterHours += getWorkedHours(startTime, endTime);
      }
    });

    function getWorkedHours(startTime, endTime) {
      if (startTime && endTime) {
        let diff = new Date(endTime).getTime() - new Date(startTime).getTime();
        diff = diff/1e3/60/60;
        return diff > 9 ? diff : 9;
      } else {
        return 9;
      }
    }

    function fillPreZero(str) {
      return ('0' + str).slice(-2);
    }

    function getQuarterByMonth(num) {
      if (num < 3) {
        return [
          [`${d.getFullYear() - 1}-10`, `${d.getFullYear() - 1}-11`, `${d.getFullYear() - 1}-12`],
          [`${d.getFullYear()}-01`, `${d.getFullYear()}-02`, `${d.getFullYear()}-03`]
        ];
      } else if (num < 6) {
        return [
          [`${d.getFullYear()}-01`, `${d.getFullYear()}-02`, `${d.getFullYear()}-03`],
          [`${d.getFullYear()}-04`, `${d.getFullYear()}-05`, `${d.getFullYear()}-06`]
        ];
      } else if (num < 9) {
        return [
          [`${d.getFullYear()}-04`, `${d.getFullYear()}-05`, `${d.getFullYear()}-06`],
          [`${d.getFullYear()}-07`, `${d.getFullYear()}-08`, `${d.getFullYear()}-09`]
        ];
      } else {
        return [
          [`${d.getFullYear()}-07`, `${d.getFullYear()}-08`, `${d.getFullYear()}-09`],
          [`${d.getFullYear()}-10`, `${d.getFullYear()}-11`, `${d.getFullYear()}-12`]
        ];
      }
    }

    const obj = {
      name,
      no,
      lastUpdateTime,
      workedDays,
      workedHours,
      avgHour: (workedHours / workedDays).toFixed(2),
      quarterDays,
      quarterHours,
      avgQuarterHour: (quarterHours / quarterDays).toFixed(2),
      lastQuarterDays,
      lastQuarterHours,
      avgLastQuarterHour: (lastQuarterHours / lastQuarterDays).toFixed(2),
    }
    chrome.storage.sync.set(obj, function(){});
    console.log('worktime.js', obj)
  }
}, 500);