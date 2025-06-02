#REAL-TIME-COLLABORATIVE-DOCUMENT-EDITOR
#COMPANY: CODTECH IT SOLUTIONS 
#NAME:SK JASIMUDDIN 
#INTERN ID:CT04DL1275 
#DOMAIN:FULL STACK DEVELOPMENT 
#DURATION:4 WEEKS 
#MENTOR:NEELA SANTOSH 
#about project 
Frontend Tools:
HTML is used to structure the web pages, such as the login screen and the editor area.

CSS is used for styling the layout — for example, the positioning of input boxes, buttons, and the editor itself.

JavaScript is used to control browser behavior and user interaction on the page. For example, when the user clicks “Join,” JavaScript captures their name and document ID and connects to the backend.

Quill.js is the rich-text editor used in this project. It provides features like bold, italic, underline, bullet points, and headers. It allows users to type and edit text with formatting, and it supports document content as "deltas" — a special format for describing text changes.

Socket.IO client (JavaScript) is used to connect the browser to the backend server over WebSockets. This allows sending and receiving real-time text updates without reloading the page.

Backend Tools:
Node.js is the backend JavaScript runtime used to build the server-side logic. It runs the code that handles user connections, receives document edits, and broadcasts them to other users.

Express.js is the framework used with Node.js to create the HTTP server and manage routes. It also serves the static files (HTML, CSS, JS) to the browser.

Socket.IO server (Node.js) is what powers the real-time updates. It listens for events from clients, such as “text-change” or “join,” and then sends updates to all connected users in the same document room.

Mongoose is a library that connects the server to MongoDB and helps define the schema for how documents are stored. In this project, each document has a unique ID and a "content" field that holds the rich-text data.

MongoDB is the database used to save and load document contents. When a user joins a document, the server either fetches the existing content from MongoDB or creates a new empty document. Changes are continuously saved as the user types.

dotenv is used to securely load sensitive configuration values like the MongoDB connection string from a .env file, keeping them separate from the source code.

quill-delta is a helper tool that lets the server merge changes to documents correctly by applying new deltas to existing document content, ensuring accuracy during collaboration.

Together, these tools create a smooth, real-time editing experience. The frontend connects to the backend via WebSockets, edits are broadcast instantly to others, and the backend ensures everything is saved and synced correctly. This project combines modern web development practices with practical use of real-time communication and database integration
