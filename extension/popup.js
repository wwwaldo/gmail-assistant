document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('api-key');
  const saveButton = document.getElementById('save');
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
      setTimeout(() => {
        statusElement.classList.remove('show');
      }, 2000);
    });
  });

  // Reset extension
  resetButton.addEventListener('click', async () => {
    // Reset Gmail interface
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
