const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [{ question: String, answer: String }],
  createdAt: { type: Date, default: Date.now },
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
