const activeUsers = {};


const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Remove deprecated options (no need for useNewUrlParser, etc.)
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schema
const DocumentSchema = new mongoose.Schema({
  docId: { type: String, required: true, unique: true },
  content: { type: Object, default: {} },
});

const Document = mongoose.model('Document', DocumentSchema);

// Serve static files
app.use(express.static(path.join(__dirname, '../client')));

// Serve index.html for any /doc/:id route (client-side routing)
app.get('/doc/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', async ({ username, docId }) => {
    socket.username = username;
    socket.docId = docId;
    socket.join(docId);

    console.log(`${username} joined document: ${docId}`);

    // Load or create document
    let doc = await Document.findOne({ docId });
    if (!doc) {
      doc = new Document({ docId, content: {} });
      await doc.save();
    }

    socket.emit('load-document', doc.content);

    // Add user to the active list
    if (!activeUsers[docId]) activeUsers[docId] = [];
    activeUsers[docId].push(username);

    // Notify all users in the doc room
    io.to(docId).emit('user-list', activeUsers[docId]);
  });

  socket.on('text-change', async (delta) => {
    if (!socket.docId) return;

    socket.to(socket.docId).emit('text-change', delta);

    const doc = await Document.findOne({ docId: socket.docId });
    if (!doc) return;

    const QuillDelta = require('quill-delta');
    const currentContent = new QuillDelta(doc.content);
    const newContent = currentContent.compose(new QuillDelta(delta));

    doc.content = newContent;
    await doc.save();
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.username || socket.id);

    const { docId, username } = socket;
    if (docId && username && activeUsers[docId]) {
      // Remove user from active list
      activeUsers[docId] = activeUsers[docId].filter(name => name !== username);

      // Broadcast updated list
      io.to(docId).emit('user-list', activeUsers[docId]);
    }
  });
});


server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
