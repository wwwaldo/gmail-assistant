# Claude Gmail Assistant

A Chrome extension that uses Claude AI to automatically classify your emails into categories (Travel, Work, Other).

## Features

- AI-powered email classification using Claude 3
- Privacy-focused (only processes email subject and sender)
- Real-time classification of new emails
- Smart categorization into Travel, Work, and Other

## Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable Developer Mode
4. Click "Load unpacked" and select the `extension` directory
5. Click the extension icon and enter your Anthropic API key

## ⚠️ Security Warning

This is a personal-use tool that stores and uses your Anthropic API key in the browser context. While we take precautions (using Chrome's secure storage and background scripts), this is not recommended for production use. A proper production implementation should use a backend server to handle API calls.

## Privacy & Security

- Only sends email subject and sender to Claude API
- No email body content is transmitted
- API keys stored securely in Chrome's sync storage
- Background script isolates API calls from webpage

## Technical Details

- Built with Chrome Extension Manifest V3
- Uses Claude 3 Sonnet model for classification
- Service Worker architecture for API handling
- Real-time DOM observation for email detection

## Limitations

- Currently only works when Gmail tab is open
- Requires manual API key configuration
- No background/bulk processing yet
- Cost: ~$0.00533 per classification

## Development

```bash
# Clone repository
git clone https://github.com/yourusername/claude-gmail-assistant.git

# Install dependencies (if any added in future)
# npm install

# Load extension in Chrome
# Follow installation steps above
```

## Future Plans

- [ ] Gmail API integration for background processing
- [ ] Bulk classification support
- [ ] User-configurable classification rules
- [ ] Settings interface for customization

## Contributing

Feel free to open issues or submit PRs!

## License

[Add your chosen license]
