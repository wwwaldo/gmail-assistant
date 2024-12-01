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

  // Update stats when popup opens
  updateStats();
});

async function updateStats() {
  // Query active Gmail tab
  const tabs = await chrome.tabs.query({
    url: '*://mail.google.com/*'
  });

  if (tabs.length === 0) {
    document.getElementById('category-stats').innerHTML = '<div>Open Gmail to see classifications</div>';
    return;
  }

  // Get classifications from content script
  chrome.tabs.sendMessage(tabs[0].id, { type: 'getStats' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error getting stats:', chrome.runtime.lastError);
      return;
    }

    const { counts, recentEmails } = response;

    // Update counts
    document.getElementById('travel-count').textContent = counts.TRAVEL || 0;
    document.getElementById('work-count').textContent = counts.WORK || 0;
    document.getElementById('other-count').textContent = counts.OTHER || 0;

    // Update recent emails
    const recentEmailsContainer = document.getElementById('recent-emails');
    recentEmailsContainer.innerHTML = recentEmails
      .map(email => `
        <div class="email-item">
          <div class="email-subject">${email.subject}</div>
          <div class="email-category">${email.category}</div>
        </div>
      `)
      .join('');
  });
}
