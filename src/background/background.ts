chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => changeInfo.status === 'complete' && tab.active &&
  chrome.tabs.query({ active: true, currentWindow: true, }, tabs => tabs[0] &&
    chrome.tabs.sendMessage(tabs[0].id, {}, response => {
      console.log('got', response);
    })
  )
);
