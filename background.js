const CSS_STYLE_CODE = `
  *:not(head):not(script) {
    outline: 1px solid red;
  }
`;

function getCssStyleStatus(tabId) {
  return browser.storage.local.get(`cssStyleStatus_${tabId}`)
    .then((result) => result[`cssStyleStatus_${tabId}`])
    .catch((error) => {
      console.error('Failed to retrieve CSS style status:', error);
      return null;
    });
}

function setCssStyleStatus(tabId, status) {
  return browser.storage.local.set({ [`cssStyleStatus_${tabId}`]: status })
    .catch((error) => {
      console.error('Failed to set CSS style status:', error);
    });
}

function applyCssStyle(tabId) {
  // Apply the CSS style
  browser.tabs.insertCSS(tabId, {
    code: CSS_STYLE_CODE
  })
    .then(() => {
      console.log('CSS style applied for tab:', tabId);
      setCssStyleStatus(tabId, 'on');
    })
    .catch((error) => {
      console.error('Failed to apply CSS style:', error);
    });
}

function removeCssStyle(tabId) {
  // Remove the CSS style
  browser.tabs.removeCSS(tabId, {
    code: CSS_STYLE_CODE
  })
    .then(() => {
      console.log('CSS style removed for tab:', tabId);
      setCssStyleStatus(tabId, 'off');
    })
    .catch((error) => {
      console.error('Failed to remove CSS style:', error);
    });
}

function toggleCssStyle(tab) {
  const tabId = tab.id;
  getCssStyleStatus(tabId)
    .then((cssStyleStatus) => {
      console.log(cssStyleStatus);
      if (cssStyleStatus === 'on') {
        removeCssStyle(tabId);
      } else {
        applyCssStyle(tabId);
      }
    });
}

function reApplyCssStyle(tab) {
  const tabId = tab.id;
  getCssStyleStatus(tabId)
    .then((cssStyleStatus) => {
      if (cssStyleStatus === 'on') {
        applyCssStyle(tabId);
      }
    });
}

// Toggle the CSS style when the browser action icon is clicked
browser.browserAction.onClicked.addListener(toggleCssStyle);

// Apply the CSS style when the page is refreshed or navigated within the same tab
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    reApplyCssStyle(tab);
  }
});
