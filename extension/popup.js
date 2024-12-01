document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('api-key');
  const saveButton = document.getElementById('save');
  const statusElement = document.getElementById('status');

  // Load saved API key
  const data = await chrome.storage.sync.get('anthropicApiKey');
  if (data.anthropicApiKey) {
    apiKeyInput.value = data.anthropicApiKey;
  }

  // Save API key
  saveButton.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      alert('Please enter your Claude API key');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      alert('Invalid API key format. It should start with "sk-"');
      return;
    }

    await chrome.storage.sync.set({ anthropicApiKey: apiKey });
    
    // Show success message
    statusElement.classList.add('show');
    setTimeout(() => {
      statusElement.classList.remove('show');
    }, 2000);
  });
});
