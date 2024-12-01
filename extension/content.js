// Content script for Gmail integration
console.log('Content Script: Claude Gmail Assistant loaded');

// Watch for new emails
function watchForNewEmails() {
  console.log('Content Script: Setting up email observer');
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        // Check for emails in detail view
        if (node.querySelector && node.querySelector('.adn.ads')) {
          const emailContainer = node.querySelector('.adn.ads');
          if (!emailContainer.hasAttribute('data-claude-category')) {
            console.log('Content Script: New unclassified email detected (detail view)');
            classifyEmail(node);
          }
        }
        
        // Check for selected email in list view
        if (node.classList && node.classList.contains('zA')) {
          if (node.classList.contains('x7') && !node.hasAttribute('data-claude-category')) {
            console.log('Content Script: New unclassified email detected (list view)');
            classifyEmailFromList(node);
          }
        }
      }
    }
  });

  // Observe both the email list and detail containers
  const emailContainers = [
    document.querySelector('.AO'),  // Detail view
    document.querySelector('.aeF')  // List view
  ];

  emailContainers.forEach(container => {
    if (container) {
      console.log('Content Script: Found email container, starting observer');
      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']  // Watch for selection changes
      });
    }
  });
}

// Get email content from detail view
function getEmailContent(emailNode) {
  const subject = emailNode.querySelector('.hP')?.innerText || '';
  const sender = emailNode.querySelector('.gD')?.innerText || '';
  
  console.log('Content Script: Extracted email content:', { subject, sender });
  return {
    subject,
    sender
  };
}

// Get email content from list view
function getEmailContentFromList(emailNode) {
  const subject = emailNode.querySelector('.bog')?.innerText || '';
  const sender = emailNode.querySelector('.yP, .zF')?.innerText || '';
  
  console.log('Content Script: Extracted email content from list:', { subject, sender });
  return {
    subject,
    sender
  };
}

// Classify email from detail view
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

    console.log('Content Script: Classification result:', result);
    
    // Add classification to email
    const emailContainer = emailNode.querySelector('.adn.ads');
    emailContainer.setAttribute('data-claude-category', result.category);

  } catch (error) {
    console.error('Content Script: Error during classification:', error);
  }
}

// Classify email from list view
async function classifyEmailFromList(emailNode) {
  console.log('Content Script: Starting classification for list email...');
  
  const emailContent = getEmailContentFromList(emailNode);
  
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

    console.log('Content Script: Classification result:', result);
    
    // Add classification to email in list
    emailNode.setAttribute('data-claude-category', result.category);

  } catch (error) {
    console.error('Content Script: Error during classification:', error);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content Script: Received message:', request.type);
  
  if (request.type === 'reset') {
    // Remove all classification attributes
    const detailEmails = document.querySelectorAll('.adn.ads');
    const listEmails = document.querySelectorAll('.zA');
    
    detailEmails.forEach(email => {
      email.removeAttribute('data-claude-category');
    });
    
    listEmails.forEach(email => {
      email.removeAttribute('data-claude-category');
    });
    
    sendResponse({ success: true });
  } 
  else if (request.type === 'classifySelected') {
    console.log('Content Script: Looking for selected emails...');
    
    // Debug: Log all email rows and their classes
    const allEmails = document.querySelectorAll('.zA');
    console.log('Content Script: Found', allEmails.length, 'total emails');
    console.log('Content Script: Email details:', Array.from(allEmails).map(email => ({
      classes: email.className,
      selected: email.getAttribute('aria-selected'),
      checked: email.querySelector('input[type="checkbox"]')?.checked
    })));

    // Try different selection methods
    const selectedEmails = document.querySelectorAll('.zA.x7');
    console.log('Content Script: Found', selectedEmails.length, 'selected emails');
    
    let classifiedCount = 0;
    
    // Classify each selected email
    Promise.all(
      Array.from(selectedEmails).map(async (email) => {
        if (!email.hasAttribute('data-claude-category')) {
          await classifyEmailFromList(email);
          classifiedCount++;
        }
      })
    ).then(() => {
      console.log('Content Script: Classified', classifiedCount, 'emails');
      sendResponse({ count: classifiedCount });
    });
    
    return true; // Keep channel open for async response
  }
  return true;
});

// Initialize
watchForNewEmails();
