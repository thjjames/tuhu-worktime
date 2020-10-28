// DEBUG
console.log('background.js');

chrome.browserAction.setBadgeText({text: '工时'});
// chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]});

// 代价太高 不如interval轮询
// chrome.webRequest.onCompleted.addListener(
//   function(details) {
//     console.log(details);
//   }, {
//     urls:[
//       'https://tuhu.peoplus.cn/web/dataset/search_read'
//     ],
//     types: ["xmlhttprequest"]
//   }
// );
  