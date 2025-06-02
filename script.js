const socket = io();
let quill;
let username = null;

// Get document ID from URL
const docId = window.location.pathname.split('/doc/')[1] || 'default-doc';

// DOM elements
const loginContainer = document.getElementById('login-container');
const editorWrapper = document.getElementById('editor-wrapper');
const joinBtn = document.getElementById('join-btn');
const usernameInput = document.getElementById('username-input');
const userInfo = document.getElementById('user-info');

    // Add this near the top with other DOM selectors
const userList = document.createElement('div');
userList.id = "user-list";
document.getElementById('editor-wrapper').appendChild(userList);

// Show user list when received
socket.on('user-list', (userArray) => {
  userList.innerHTML = `👥 Online Users: ${userArray.join(', ')}`;
});


joinBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (!name) return alert('Please enter your name');

  username = name;

  loginContainer.style.display = 'none';
  editorWrapper.style.display = 'block';

  quill = new Quill('#editor-container', { theme: 'snow' });
  userInfo.textContent = `You are logged in as: ${username}`;

  socket.emit('join', { username, docId });

  socket.on('load-document', (content) => {
    quill.setContents(content);
    quill.enable();
  });

  socket.on('text-change', (delta) => {
    quill.updateContents(delta);
  });

 quill.on('text-change', (delta, oldDelta, source) => {
  if (source === 'user') {
    socket.emit('text-change', delta);
  }
  });
});