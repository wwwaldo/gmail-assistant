// Content script for Gmail integration
console.log('Content Script: Claude Gmail Assistant loaded');

// Watch for new emails
function watchForNewEmails() {
  console.log('Content Script: Setting up email observer');
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.querySelector && node.querySelector('.adn.ads')) {
          // Check if we've already classified this email
          const emailContainer = node.querySelector('.adn.ads');
          if (!emailContainer.hasAttribute('data-claude-category')) {
            console.log('Content Script: New unclassified email detected');
            classifyEmail(node);
          }
        }
      }
    }
  });

  // Observe the email list container
  const emailList = document.querySelector('.AO');
  if (emailList) {
    console.log('Content Script: Found email container, starting observer');
    observer.observe(emailList, {
      childList: true,
      subtree: true
    });
  } else {
    console.warn('Content Script: Could not find email container (.AO)');
  }
}

// Get email content for classification
function getEmailContent(emailNode) {
  const subject = emailNode.querySelector('.hP')?.innerText || '';
  const sender = emailNode.querySelector('.gD')?.innerText || '';
  
  console.log('Content Script: Extracted email content:', { subject, sender });
  return {
    subject,
    sender
  };
}

// Classify email with Claude API via background script
async function classifyEmail(emailNode) {
  console.log('Content Script: Starting classification for email...');
  
  const emailContent = getEmailContent(emailNode);
  
  try {
    console.log('Content Script: Sending message to background script');
    const result = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        type: 'classifyEmail',
        emailContent: emailContent
      }, response => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });

    console.log('Content Script: Classification result:', {
      category: result.category,
      isValidCategory: ['TRAVEL', 'WORK', 'OTHER'].includes(result.category)
    });

    // Maybe add visual indicator of classification here
    const emailContainer = emailNode.querySelector('.adn.ads');
    emailContainer.setAttribute('data-claude-category', result.category);

  } catch (error) {
    console.error('Content Script: Error during classification:', error);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getStats') {
    const stats = getClassificationStats();
    sendResponse(stats);
  }
  return true; // Keep channel open for async response
});

// Gather classification stats
function getClassificationStats() {
  const emails = document.querySelectorAll('.adn.ads');
  const counts = {
    TRAVEL: 0,
    WORK: 0,
    OTHER: 0
  };
  
  const recentEmails = [];
  
  emails.forEach(email => {
    const category = email.getAttribute('data-claude-category');
    if (category) {
      counts[category] = (counts[category] || 0) + 1;
      
      // Add to recent emails if we have subject
      const subject = email.closest('tr')?.querySelector('.hP')?.innerText;
      if (subject && recentEmails.length < 5) {
        recentEmails.push({
          subject,
          category
        });
      }
    }
  });
  
  return {
    counts,
    recentEmails
  };
}

// Initialize
watchForNewEmails();
