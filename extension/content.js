// Content script for Gmail integration
console.log('Content Script: Claude Gmail Assistant loaded');

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
  console.log('Content Script: Received message:', request);
  
  if (request.type === 'reset') {
    console.log('Content Script: Handling reset');
    // Remove all classification attributes
    const listEmails = document.querySelectorAll('.zA');
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
    console.log('Content Script: Found', selectedEmails.length, 'selected emails with class x7');
    
    let classifiedCount = 0;
    
    // Classify each selected email
    Promise.all(
      Array.from(selectedEmails).map(async (email) => {
        console.log('Content Script: Processing email:', email.className);
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
