const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  type: String,
  _postId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "posts",
    required: true,
  },
  _userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "accounts",
    required: true,
  },
  content: String,
});

module.exports = mongoose.model("Comment", commentSchema)
