const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model (both sender and receiver)
      required: true
    }
  ],
  messages: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who sent the message
        required: true
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who will receive the message
        required: true
      },
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        required: true,
        default: Date.now
      }
    }
  ],
  chatName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

module.exports = Chat;
