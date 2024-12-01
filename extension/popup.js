document.addEventListener('DOMContentLoaded', async () => {
  console.log('POPUP LOADED!!!!');
  
  const apiKeyInput = document.getElementById('api-key');
  const saveButton = document.getElementById('save');
  const classifyButton = document.getElementById('classify');
  const resetButton = document.getElementById('reset');
  const statusElement = document.getElementById('status');

  console.log('Popup: Found UI elements:', { 
    apiKeyInput: !!apiKeyInput,
    saveButton: !!saveButton,
    classifyButton: !!classifyButton,
    resetButton: !!resetButton
  });

  if (!classifyButton) {
    console.error('CLASSIFY BUTTON NOT FOUND!');
  } else {
    console.log('Found classify button:', classifyButton);
  }

  // Load saved API key
  chrome.storage.sync.get(['anthropicApiKey'], (result) => {
    if (result.anthropicApiKey) {
      apiKeyInput.value = result.anthropicApiKey;
      console.log('Popup: Loaded saved API key');
    }
  });

  // Save API key
  saveButton.addEventListener('click', () => {
    console.log('SAVE CLICKED!');
    const apiKey = apiKeyInput.value;
    chrome.storage.sync.set({ anthropicApiKey: apiKey }, () => {
      statusElement.textContent = 'Settings saved!';
      statusElement.classList.add('show');
      setTimeout(() => statusElement.classList.remove('show'), 2000);
    });
  });

  // Classify selected emails
  classifyButton.addEventListener('click', async () => {
    console.log('CLASSIFY BUTTON CLICKED!!!!');
    try {
      const tabs = await chrome.tabs.query({
        url: '*://mail.google.com/*'
      });
      
      console.log('Popup: Found Gmail tabs:', tabs.length);
      
      if (tabs.length > 0) {
        console.log('Popup: Sending classifySelected message to tab:', tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, { type: 'classifySelected' }, (response) => {
          console.log('Popup: Got response:', response);
          if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError);
          }
          if (response && response.count > 0) {
            statusElement.textContent = `Classified ${response.count} email(s)!`;
          } else {
            statusElement.textContent = 'No emails selected';
          }
          statusElement.classList.add('show');
          setTimeout(() => statusElement.classList.remove('show'), 2000);
        });
      } else {
        console.log('NO GMAIL TAB FOUND!');
        statusElement.textContent = 'Please open Gmail first!';
        statusElement.classList.add('show');
        setTimeout(() => statusElement.classList.remove('show'), 2000);
      }
    } catch (error) {
      console.error('Error in classify click handler:', error);
    }
  });

  // Reset extension
  resetButton.addEventListener('click', async () => {
    console.log('RESET CLICKED!');
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

  // Log that we finished setup
  console.log('POPUP SETUP COMPLETE!');
});
