// models/ToolboxTalk.js

const mongoose = require("mongoose");

const toolboxTalkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date },
  time: { type: String }, 
  presenter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: String }], 
  description: { type: String },
  status: { type: String },
  image: [], 
}, { timestamps: true });

const ToolboxTalk = mongoose.model("ToolboxTalk", toolboxTalkSchema);

module.exports = ToolboxTalk;
