# Traceback

A minimal single-page application for tracking and managing coding errors across multiple projects.

## Overview

Traceback provides a clean, dark-themed interface for logging, categorizing, and resolving errors encountered during development. Organize errors by project with status tracking (solved, pending) and direct links to GitHub repositories.

## Features

- **Project-based organization**: Separate error logs by project with sidebar navigation
- **Status tracking**: Mark errors as solved, pending, or mark for editing
- **Code snippet storage**: Store problematic code with syntax highlighting
- **GitHub integration**: Direct links to project repositories
- **Solution tracking**: Document how errors were resolved
- **Tag-based categorization**: Organize errors with custom tags
- **Clean interface**: Dark theme with color-coded status indicators

## Installation

Clone the repository and open `index.html` in your browser:

```bash
git clone <repository-url>
cd traceback
```

Start json-server:

```bash
npm install -g json-server
json-server db.json
```

Open `index.html`

## Usage

### Adding Errors

1. Click "ADD_ERROR +++" to create a new error entry
2. Fill in:
   - Error title
   - Description of the problem
   - Code snippet causing the issue
   - Project name
   - GitHub repository link (optional)
   - Tags for categorization

### Managing Errors

- **Sidebar navigation**: Browse errors by project, grouped by status
- **Status updates**: Click "SOLVED" to mark resolved, "MARK_PENDING" for ongoing issues
- **Edit/Delete**: Use "EDIT_ERROR" or "DELETE_ERROR" buttons
- **GitHub integration**: Click "VIEW_REPO →" to open the linked repository
- **Solution tracking**: Document resolution steps for solved errors

### Interface

- **Left sidebar**: Project-grouped error list with status indicators
- **Main panel**: Detailed error view with code snippets and metadata
- **Status badges**: Color-coded SOLVED (yellow), PENDING (pink) indicators

## File Structure

```
traceback/
├── index.html          # Main application interface
├── css/               # Styling and layout
├── src/               # Application logic
├── db.json            # Local data structure example
├── package.json       # Project metadata
└── README.md          # This file
```

## Data Format

Errors are stored in this structure:

```json
{
  "errors": [
    {
      "id": "1",
      "title": "getElementById returns null",
      "description": "Element not found when trying to select by ID, usually because DOM hasn't loaded",
      "code": "const button = document.getElementById('submit-btn');\\nbutton.addEventListener(...)",
      "tags": ["JavaScript", "DOM", "null"],
      "status": "solved",
      "solution": "Wrap in DOMContentLoaded event or place script before closing body tag",
      "timestamp": "2025-06-25T13:11:53.153Z",
      "project": "Todo List App",
      "githubLink": "https://github.com/user/todo-app"
    }
  ]
}
```

## Future improvements

### Keyboard Shortcuts

- `Ctrl/Cmd + N`: Add new error
- `Ctrl/Cmd + E`: Edit selected error
- `Ctrl/Cmd + D`: Delete selected error
- `Escape`: Close modals/forms

## License

MIT License - see LICENSE file for details.
