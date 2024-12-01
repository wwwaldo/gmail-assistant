// Content script for Gmail integration

// Get email content from list view
function getEmailContentFromList(emailNode) {
  const subject = emailNode.querySelector('.bog')?.innerText || '';
  const sender = emailNode.querySelector('.yP, .zF')?.innerText || '';
  return {
    subject,
    sender
  };
}

// Classify email from list view
async function classifyEmailFromList(emailNode) {
  const emailContent = getEmailContentFromList(emailNode);
  
  try {
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
    
    // Add classification to email in list
    emailNode.setAttribute('data-claude-category', result.category);

  } catch (error) {
    console.error('Classification failed:', error);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'reset') {
    // Remove all classification attributes
    const listEmails = document.querySelectorAll('.zA');
    listEmails.forEach(email => {
      email.removeAttribute('data-claude-category');
    });
    sendResponse({ success: true });
  } 
  else if (request.type === 'classifySelected') {
    // Find selected emails in list view
    const selectedEmails = document.querySelectorAll('.zA.x7');
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
      sendResponse({ count: classifiedCount });
    });
    
    return true; // Keep channel open for async response
  }
  return true;
});
