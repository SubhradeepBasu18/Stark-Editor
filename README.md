# Stark Editor

A real-time collaborative code editor built with React, Monaco Editor, and Socket.IO. Multiple users can edit code simultaneously with live synchronization and user presence awareness.

## Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Monaco Editor** - VS Code's code editor engine
- **TailwindCSS** - Utility-first CSS framework
- **YJS** - Real-time collaboration framework
- **Y-Monaco** - Monaco Editor bindings for YJS
- **Y-Socket.IO** - WebSocket provider for real-time sync

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework for serving static files
- **Socket.IO** - Real-time bidirectional communication
- **Y-Socket.IO** - Server-side YJS integration

### DevOps
- **Docker** - Multi-stage containerization
- **Docker Compose** - Container orchestration (if applicable)

## Features

- **Real-time Collaboration** - Multiple users can edit the same document simultaneously
- **Live User Presence** - See who's currently online and viewing the code
- **Syntax Highlighting** - Monaco Editor provides rich syntax highlighting
- **Modern UI** - Clean, dark-themed interface with TailwindCSS
- **Responsive Design** - Works seamlessly across different screen sizes

## Quick Start

### Using Docker
```bash
docker build -t stark-editor .
docker run -p 3000:3000 stark-editor
```

### Manual Setup

1. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

2. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Copy build to backend**
   ```bash
   cp -r dist ../backend/public
   ```

4. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter your username when prompted
2. Start coding in the Monaco Editor
3. Invite others to join by sharing the URL
4. See real-time edits and user presence in the collaborators sidebar

## Architecture

The application uses a client-server architecture where:
- Frontend handles the UI and real-time collaboration
- Backend manages WebSocket connections and document synchronization
- YJS provides the CRDT (Conflict-free Replicated Data Type) algorithm for conflict resolution

## About YJS

YJS is a powerful CRDT implementation that enables seamless real-time collaboration without central coordination. It provides:

- **Conflict-free Synchronization** - Multiple users can edit simultaneously without conflicts
- **Automatic Merging** - Changes from different users are merged automatically and consistently
- **Offline Support** - Edits are synced when connectivity is restored
- **Efficient Updates** - Only changes are transmitted, not entire documents
- **Type Safety** - Shared data structures include Text, Map, Array, and XML types

In Stark Editor, YJS powers the collaborative editing experience through:
- `y-monaco` - Integrates YJS with Monaco Editor for real-time code editing
- `y-socket.io` - Provides WebSocket-based synchronization between clients
- Awareness API - Tracks user presence and cursor positions
