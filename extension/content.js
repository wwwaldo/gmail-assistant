// Content script for Gmail integration
console.log('Claude Gmail Assistant loaded');

// Watch for new emails
function watchForNewEmails() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.querySelector && node.querySelector('.adn.ads')) {
          classifyEmail(node);
        }
      }
    }
  });

  // Observe the email list container
  const emailList = document.querySelector('.AO');
  if (emailList) {
    observer.observe(emailList, {
      childList: true,
      subtree: true
    });
  }
}

// Get email content for classification
function getEmailContent(emailNode) {
  const subject = emailNode.querySelector('.hP')?.innerText || '';
  const sender = emailNode.querySelector('.gD')?.innerText || '';
  const body = emailNode.querySelector('.a3s')?.innerText || '';

  return {
    subject,
    sender,
    body
  };
}

// Classify email with Claude API
async function classifyEmail(emailNode) {
  console.log('Starting classification for email...');
  
  const emailContent = getEmailContent(emailNode);
  
  const apiKey = await chrome.storage.sync.get('anthropicApiKey');
  if (!apiKey.anthropicApiKey) {
    console.warn('No API key found, skipping classification');
    return;
  }
  
  console.log('Making Claude API request...');
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.anthropicApiKey,
        'anthropic-version': '2023-06-01'
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
          Subject: ${emailContent.subject}
          Body: ${emailContent.body}`
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const category = data.content.trim().toUpperCase();
    
    console.log('Classification result:', {
      category: category,
      isValidCategory: ['TRAVEL', 'WORK', 'OTHER'].includes(category)
    });

  } catch (error) {
    console.error('Error during classification:', error);
  }
}

// Initialize
watchForNewEmails();
