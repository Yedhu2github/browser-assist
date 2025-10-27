document.getElementById('btn').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTabId = tabs[0].id;
    let message = "duck";
    chrome.tabs.sendMessage(activeTabId, message, function (response) {
      console.log(response);
    });
  })
})

const highlightColors = {
  "topic1" : 'red',
  "topic2" : 'blue',
  "topic3" : 'green',
  "topic4" : 'cyan'
}
