# Claude Gmail Assistant

A minimal Chrome extension that uses Claude AI to automatically classify your emails into categories (Travel, Work, Other).

## Features

- 🤖 Real-time email classification using Claude 3
- 🎯 Simple categorization: Travel, Work, or Other
- 🔒 Privacy-focused: only processes email subject and sender
- ⚡ Lightweight: classifies emails as they appear
- 🧹 Clean: no UI modifications to Gmail

## Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable Developer Mode
4. Click "Load unpacked" and select the `extension` directory
5. Click the extension icon and enter your Anthropic API key

## Privacy & Security

⚠️ This is a personal-use tool that stores your Anthropic API key in Chrome's storage. While we use Chrome's secure storage, a production implementation should use a backend server to handle API calls.

- Only sends email subject and sender to Claude API
- No email content is transmitted
- API keys stored in Chrome's sync storage
- Background script isolates API calls

## Development

```bash
# Clone repository
git clone https://github.com/yourusername/claude-gmail-assistant.git

# Load in Chrome
# Follow installation steps above
```

## Technical Details

- Chrome Extension (Manifest V3)
- Uses Claude 3 Sonnet model
- Service Worker architecture for API handling
- Real-time DOM observation for email detection

## Cost Considerations

- Approximately $0.00533 per email classification
- Consider usage patterns for your inbox volume

## License

[Add your chosen license]
