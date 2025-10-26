document.getElementById('btn').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTabId = tabs[0].id;
    let message = "duck";
    chrome.tabs.sendMessage(activeTabId, message, function (response) {
      console.log(response);
    });
  })
    
})
