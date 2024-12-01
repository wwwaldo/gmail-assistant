# Claude Gmail Assistant

A Chrome extension that adds Claude AI capabilities to Gmail for smart email analysis and response suggestions.

## Features
- One-click email analysis with Claude AI
- Smart summarization of email content
- Priority level assessment
- Response suggestions
- Seamless Gmail integration

## Installation
1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `extension` folder from this repository

## Setup
1. Click the extension icon in Chrome
2. Enter your Claude API key (starts with 'sk-')
3. Open Gmail and you'll see a "✨ Claude Assistant" button in your email view

## Usage
1. Open an email in Gmail
2. Click the "✨ Claude Assistant" button
3. View the AI analysis including:
   - Brief summary
   - Key points/requests
   - Suggested response points
   - Priority level

## Project Structure
```
claude-gmail-assistant/
├── extension/
│   ├── manifest.json     # Extension configuration
│   ├── content.js        # Gmail integration
│   ├── popup.html        # Settings popup
│   ├── popup.js         # Settings logic
│   ├── styles.css       # UI styling
│   └── icons/           # Extension icons
└── README.md

## Security
- Your Claude API key is stored securely in Chrome's extension storage
- No email data is stored, only processed in memory
- Direct integration with Gmail's interface (no email credentials needed)
