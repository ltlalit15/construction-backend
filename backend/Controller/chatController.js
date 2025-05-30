const Chat = require("../Model/chatModel");
const User = require("../Model/userModel");

const asyncHandler = require("express-async-handler");


const createChat = async (req, res) => {
  const { userIds, message, chatName } = req.body;
  
  try {
    // Ensure the users exist
    const users = await User.find({ '_id': { $in: userIds } });

    if (users.length !== userIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more users not found'
      });
    }

    // Create the chat
    const newChat = new Chat({
      users: userIds,
      chatName,
      messages: [{
        senderId: userIds[0], // Assuming the first user sends the first message
        receiverId: userIds[1], // Assuming the second user is the receiver
        message,
        timestamp: new Date()
      }]
    });

    const savedChat = await newChat.save();

    // Emit new chat using socket.io
    const io = req.app.get('socketio');
    io.emit('new_chat', savedChat);

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: savedChat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating chat',
      error: error.message
    });
  }
};


const createGroupChat = async (req, res) => {
  const { userIds, message, chatName } = req.body;

  try {
    // Ensure the users exist
    const users = await User.find({ '_id': { $in: userIds } });

    if (users.length !== userIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more users not found'
      });
    }

    // Create the group chat
    const newChat = new Chat({
      users: userIds,
      chatName,
      messages: [{
        senderId: userIds[0], // Assuming the first user sends the first message
        message,
        timestamp: new Date()
      }]
    });

    const savedChat = await newChat.save();

    // 🛜 Emit new chat using socket.io
    const io = req.app.get('socketio');
    io.emit('new_chat', savedChat);

    res.status(201).json({
      success: true,
      message: 'Group chat created successfully',
      data: savedChat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating group chat',
      error: error.message
    });
  }
};



const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate('users', 'firstName lastName') // Populate user names
      .populate({
        path: 'messages',
        populate: [
          { path: 'senderId', select: 'firstName lastName' },  // Populate sender's name
          { path: 'receiverId', select: 'firstName lastName' }, // Populate receiver's name
        ],
      })
      .sort({ 'messages.timestamp': -1 }); // Sort by latest message timestamp

    console.log(chats);

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chats',
      error: error.message,
    });
  }
};


const searchChats = async (req, res) => {
  const { searchTerm } = req.query;

  try {
    const chats = await Chat.find({
      $or: [
        { chatName: { $regex: searchTerm, $options: 'i' } },
        { 'messages.message': { $regex: searchTerm, $options: 'i' } }
      ]
    })
      .populate('users', 'firstName lastName')
      .populate('messages.senderId', 'firstName lastName')
      .populate('messages.receiverId', 'firstName lastName')
      .sort({ 'messages.timestamp': -1 });

    res.status(200).json({
      success: true,
      data: chats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching chats',
      error: error.message
    });
  }
};


// Send Message Controller
// const sendMessage = asyncHandler(async (req, res) => {
//   const { chatId, senderId, receiverId, message } = req.body;

 

//   try {
//     const chat = await Chat.findById(chatId);

//     if (!chat) {
//       return res.status(404).json({
//         success: false,
//         message: 'Chat not found'
//       });
//     }

//     const newMessage = {
//       senderId,
//       receiverId,
//       message,
//       timestamp: new Date()
//     };

//     // Ensure that messages field exists and is an array
//     if (!chat.messages) {
//       chat.messages = [];
//     }

//     chat.messages.push(newMessage);
//     await chat.save();

//     // 🛜 Emit new message using socket.io
//     const io = req.app.get('socketio');
//     io.emit('new_message', { chatId, message: newMessage });

//     res.status(200).json({
//       success: true,
//       message: 'Message sent successfully',
//       data: chat
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error sending message',
//       error: error.message
//     });
//   }
// });

// <<<<<<< HEAD
// =======

const sendMessage = asyncHandler(async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    // Ensure senderId and receiverId are valid
    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Sender ID and Receiver ID are required.',
      });
    }

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message must be a non-empty string.',
      });
    }

    // Find an existing chat between the sender and receiver
    let chat = await Chat.findOne({
      users: { $all: [senderId, receiverId] },
    });

    // If no chat exists, create a new one
    if (!chat) {
      chat = new Chat({
        users: [senderId, receiverId], // Array of user IDs
        messages: [], // Initialize the messages array
        chatName: `Chat between ${senderId} and ${receiverId}`, // Set a default chat name
        status: 'active', // Set default status to active
      });

      await chat.save(); // Save the new chat
    }

    // Create the new message object
    const newMessage = {
      senderId,
      receiverId,
      message,
      timestamp: new Date(),
    };

    // Add the new message to the chat's messages array
    chat.messages.push(newMessage);

    // Save the updated chat with the new message
    await chat.save();

    // Emit the new message using socket.io
    const io = req.app.get('socketio');
    io.emit('new_message', { message: newMessage });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage, // Return the new message as a response
    });

  } catch (error) {
    console.error('Error creating chat or sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating chat or sending message',
      error: error.message,
    });
  }
});


const deleteChat = async (req, res) => {
  const { id } = req.params;  // Get the chatId from the request parameters
  console.log('Received id:', id);  // Log the chatId for debugging

  try {
    // Find the chat by its ID and delete it
    const chat = await Chat.findByIdAndDelete(id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting chat',
      error: error.message
    });
  }
};



module.exports = { createChat, getAllChats, searchChats, sendMessage, deleteChat, createGroupChat };
