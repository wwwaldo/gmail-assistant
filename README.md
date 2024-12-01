# Claude Gmail Assistant

A Chrome extension that uses Claude AI to automatically classify your Gmail messages.

## Features
- Classify selected emails with one click
- Uses Claude 3 Sonnet for intelligent categorization
- Minimal permissions required
- Privacy-focused (only processes email subject and sender)
- Simple, clean interface

## Installation
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `extension` directory
5. Add your Claude API key in the extension popup

## Usage
1. Open Gmail in Chrome
2. Select one or more emails in your inbox
3. Click the extension icon
4. Click "Classify Selected" to categorize emails
5. Classifications will be shown as data attributes (future: Gmail labels)

## Development Notes
- Built with Chrome Extension Manifest V3
- Direct integration with Anthropic's Claude API
- Uses Chrome Storage API for settings
- Content script for Gmail interaction
- Background service worker for API calls

### Debugging Tips
- Extension has three separate console contexts:
  1. Popup console (right-click extension -> Inspect)
  2. Content script console (Gmail's DevTools)
  3. Background console (chrome://extensions -> service worker)
- Popup console closes when popup closes
- Changes require extension reload and page refresh
- Background console preserves logs between popup opens
- Check manifest permissions if messages aren't received

## Cost Considerations
- Approximately $0.00533 per email classification
- Consider usage patterns for your inbox volume

## Future Improvements
- Implement Gmail API integration for:
  - Reliable label management
  - Background processing
  - Batch operations
  - No DOM dependency
  - Future-proof implementation
- Add user-configurable classification rules
- Support bulk email classification
- Add settings for customization

## Security Notes
- API key stored in Chrome sync storage
- Minimal data sent to Anthropic (subject/sender only)
- Required permissions:
  - `storage`: For API key
  - `tabs`: For Gmail tab detection
  - `host_permissions`: For Gmail and Anthropic API access

## Known Limitations
- Requires Gmail tab to be open
- Manual classification only (no auto-classification yet)
- Browser-based API calls (future: proper backend)

## License
[Add your chosen license]
