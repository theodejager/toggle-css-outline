const CSS_STYLE_CODE = `
      *:not(head):not(script) {
        outline: 1px solid red;
      }
    `;
function applyCssStyle(tabId) {
  // Apply the CSS style
  browser.tabs.insertCSS(tabId, {
    code: CSS_STYLE_CODE
  })
    .then(() => {
      console.log('CSS style applied for tab:', tabId);
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
    })
    .catch((error) => {
      console.error('Failed to remove CSS style:', error);
    });
}

function toggleCssStyle(tab) {
  const tabId = tab.id;
  browser.storage.local.get('cssStyleStatus')
    .then((result) => {
      const cssStyleStatus = result.cssStyleStatus;
		console.log(cssStyleStatus);
      if (cssStyleStatus === 'on') {
        removeCssStyle(tabId);
        browser.storage.local.set({ cssStyleStatus: 'off' });
      } else {
        applyCssStyle(tabId);
        browser.storage.local.set({ cssStyleStatus: 'on' });
      }
    })
    .catch((error) => {
      console.error('Failed to retrieve CSS style status:', error);
    });
}

function reApplyCssStyle(tab) {
  const tabId = tab.id;
  browser.storage.local.get('cssStyleStatus')
    .then((result) => {
      const cssStyleStatus = result.cssStyleStatus;
      if (cssStyleStatus === 'on') {
        applyCssStyle(tabId);
      }
    })
    .catch((error) => {
      console.error('Failed to retrieve CSS style status:', error);
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
