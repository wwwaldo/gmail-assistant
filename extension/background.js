// background.js
console.log('Background Script: Initialized');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background Script: Received message:', request.type);
  
  if (request.type === 'classifyEmail') {
    console.log('Background Script: Processing classification request');
    handleClassification(request.emailContent)
      .then(result => {
        console.log('Background Script: Classification successful:', result);
        sendResponse(result);
      })
      .catch(error => {
        console.error('Background Script: Classification failed:', error);
        sendResponse({ error: error.message });
      });
    return true;  // Will respond asynchronously
  }
});

async function handleClassification(emailContent) {
  console.log('Background Script: Starting classification');
  
  const apiKey = await chrome.storage.sync.get('anthropicApiKey');
  if (!apiKey.anthropicApiKey) {
    throw new Error('No API key configured');
  }

  console.log('Background Script: Making API request to Claude');
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey.anthropicApiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'  // WARNING: Security risk
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Classify this email into one of these categories: TRAVEL, WORK, or OTHER.

        Rules for TRAVEL:
        - ONLY use for confirmed travel bookings (flights, hotels, car rentals, train tickets)
        - ONLY use for important travel updates (gate changes, delays, cancellations)
        - DO NOT use for travel promotions, deals, or marketing
        
        Rules for WORK:
        - Use for job applications and recruiter communications
        
        Rules for OTHER:
        - Use for everything else
        
        Respond with ONLY the category name in caps: TRAVEL, WORK, or OTHER.
        
        Email:
        From: ${emailContent.sender}
        Subject: ${emailContent.subject}`
      }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Background Script: API error response:', errorText);
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Background Script: API response:', data);
  
  return {
    category: data.content[0].text.trim().toUpperCase()
  };
}
