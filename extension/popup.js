document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('api-key');
  const saveButton = document.getElementById('save');
  const classifyButton = document.getElementById('classify');
  const resetButton = document.getElementById('reset');
  const statusElement = document.getElementById('status');

  // Load saved API key
  chrome.storage.sync.get(['anthropicApiKey'], (result) => {
    if (result.anthropicApiKey) {
      apiKeyInput.value = result.anthropicApiKey;
    }
  });

  // Save API key
  saveButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value;
    chrome.storage.sync.set({ anthropicApiKey: apiKey }, () => {
      statusElement.textContent = 'Settings saved!';
      statusElement.classList.add('show');
      setTimeout(() => statusElement.classList.remove('show'), 2000);
    });
  });

  // Classify selected emails
  classifyButton.addEventListener('click', async () => {
    try {
      const tabs = await chrome.tabs.query({
        url: '*://mail.google.com/*'
      });
      
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'classifySelected' }, (response) => {
          if (chrome.runtime.lastError) {
            statusElement.textContent = 'Error: ' + chrome.runtime.lastError.message;
          } else if (response && response.count > 0) {
            statusElement.textContent = `Classified ${response.count} email(s)!`;
          } else {
            statusElement.textContent = 'No emails selected';
          }
          statusElement.classList.add('show');
          setTimeout(() => statusElement.classList.remove('show'), 2000);
        });
      } else {
        statusElement.textContent = 'Please open Gmail first!';
        statusElement.classList.add('show');
        setTimeout(() => statusElement.classList.remove('show'), 2000);
      }
    } catch (error) {
      statusElement.textContent = 'Error: ' + error.message;
      statusElement.classList.add('show');
      setTimeout(() => statusElement.classList.remove('show'), 2000);
    }
  });

  // Reset extension
  resetButton.addEventListener('click', async () => {
    const tabs = await chrome.tabs.query({
      url: '*://mail.google.com/*'
    });
    
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'reset' }, () => {
        statusElement.textContent = 'Extension reset!';
        statusElement.classList.add('show');
        setTimeout(() => statusElement.classList.remove('show'), 2000);
      });
    }
  });
});
