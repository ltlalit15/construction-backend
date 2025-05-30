// const express = require('express');
// const { DBconnect } = require('./Config/db_config');
// const routerapi = require('./routerapi');
// const path = require('path');
// const colors = require('colors');
// const cors = require('cors');
// const fileUpload = require('express-fileupload');
// require('dotenv').config();
// const session = require('express-session');

// // Create Express app
// const app = express();
// const PORT = process.env.PORT || 3000;

// // ✅ Connect to the database
// DBconnect();

// // ✅ Safe temp dir path for file uploads (cross-platform)
// const tempDir = path.join(__dirname, 'tmp');

// // ✅ CORS setup (Allow all domains or restrict it)
// app.use(cors({
//   origin: "*", // Or restrict to specific domain
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// // ✅ Parse JSON and large payloads (for handling large files or data)
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // ✅ File upload middleware (Using express-fileupload)
// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir: tempDir,
//     limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
//     safeFileNames: true,
//     preserveExtension: 4,
//     abortOnLimit: true,
//     limitHandler: function(req, res, next) {
//       res.status(400).send('File size limit exceeded');
//     }
//   }));
  
// // ✅ Static file directories (serving uploaded files)
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'upload')));

// // ✅ Session middleware (for session management)
// app.use(session({
//   secret: 'your_secret_key', // 🔒 Replace with strong secret in production
//   resave: false,
//   saveUninitialized: true,
//   cookie: { maxAge: 86400000 } // 1 day
// }));

// // ✅ Sample route (Hello World)
// app.post('/', (req, res) => {
//   res.send('Hello World');
// });

// // ✅ API Router (Your API routes)
// app.use(routerapi);

// // ✅ Static file handling for uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ✅ Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const http = require('http'); // 🛜 HTTP server banana zaruri hai socket.io ke liye
const { Server } = require('socket.io');
const { DBconnect } = require('./Config/db_config');
const routerapi = require('./routerapi');
const path = require('path');
const colors = require('colors');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const session = require('express-session');
require('dotenv').config();

// ✅ Create Express app
const app = express();
const server = http.createServer(app); // 🛜 HTTP server created for socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Frontend allowed origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});

// ✅ Make socket.io accessible inside routes/controllers
app.set('socketio', io);

// ✅ Database connect
DBconnect();

// ✅ Safe temp dir path for file uploads
const tempDir = path.join(__dirname, 'tmp');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ✅ Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: tempDir,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  safeFileNames: true,
  preserveExtension: 4,
  abortOnLimit: true,
  limitHandler: function (req, res, next) {
    res.status(400).send('File size limit exceeded');
  }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'upload')));

// ✅ Session middleware
app.use(session({
  secret: 'your_secret_key', // Change in production
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 86400000 }
}));

// ✅ Default route
app.post('/', (req, res) => {
  res.send('Hello World');
});

// ✅ API router
app.use(routerapi);

// ✅ Upload folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Socket.io basic connection check (optional)
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// ✅ Server Start (Use server.listen not app.listen!)
const PORT = process.env.PORT || 7700;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


