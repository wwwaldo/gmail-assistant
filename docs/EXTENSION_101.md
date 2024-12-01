# Chrome Extension Architecture 101

## Core Components

### 1. Manifest (manifest.json)
- The extension's "config file"
- Declares permissions, scripts, and resources
- Defines how components interact
- Must specify correct version (we use V3)

### 2. Content Scripts
- Run in the context of web pages
- Can read/modify page DOM
- Limited access to Chrome APIs
- Can't access variables/functions from the page
- Communicate via messages to background/popup

### 3. Popup
- The UI that appears when clicking extension icon
- Separate HTML/JS context from everything else
- State resets when popup closes
- Can't directly access web page
- Communicates via messages

### 4. Background Script (Service Worker)
- Long-running script in the background
- Can't access DOM
- Has access to all Chrome APIs
- Handles events and coordinates between components
- In V3: Must be a service worker (no persistent background)

## Communication Flows

### Between Components
```
Popup <-> Background <-> Content Script
        ^                     ^
        |                     |
        +---------------------+
```

- Components communicate via `chrome.runtime.sendMessage()`
- Must return `true` for async responses
- Use callbacks or Promises for responses

### Common Patterns
1. Popup -> Content: "Do something in the page"
2. Content -> Background: "Make an API call"
3. Background -> Content: "Here's the API response"
4. Content -> Popup: "Action completed"

## Debugging Tips

### Console Locations
1. Popup console: Right-click extension -> Inspect
2. Content script console: Web page's DevTools
3. Background console: chrome://extensions -> service worker
   - Only console that persists between popup opens!

### Common Issues
- Popup console closes with popup
- Content script reloads with page refresh
- Background script reloads on extension reload
- Permission errors often silent
- Message handlers must return `true` for async

### Reloading Changes
1. Change popup/content: Reload extension
2. Change background: Reload extension AND service worker
3. Change manifest: Reload extension
4. Always refresh web page after extension reload

## Best Practices

### Architecture
- Keep components focused:
  - Popup: User interface
  - Content: DOM interaction
  - Background: API calls/coordination
- Use clear message types
- Handle all error cases

### State Management
- Popup state is temporary
- Use Chrome Storage for persistence
- Background worker is non-persistent in V3
- Content script resets on page reload

### Security
- Validate all messages
- Careful with executeScript
- Don't expose sensitive data
- Use minimal permissions

### Performance
- Keep popup lightweight
- Minimize DOM operations
- Use event delegation
- Clean up listeners

## Chrome APIs to Know

### Essential
- `chrome.runtime.sendMessage()`
- `chrome.tabs.query()`
- `chrome.storage.sync`
- `chrome.runtime.onMessage`

### Common
- `chrome.tabs.executeScript()`
- `chrome.notifications`
- `chrome.contextMenus`
- `chrome.webRequest`

## Testing

### Manual Testing
- Test all components separately
- Check all message flows
- Verify error handling
- Test with slow connections

### Common Test Cases
1. Extension fresh install
2. Extension reload
3. Page refresh
4. Multiple tabs
5. Network failures
6. Permission changes

## Deployment Notes

### Publishing
- Zip the extension directory
- Submit to Chrome Web Store
- Handle review process
- Plan update strategy

### Updates
- Increment version number
- Test thoroughly
- Consider backward compatibility
- Plan rollout strategy

## Resources
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)
