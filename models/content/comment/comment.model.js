const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  type: String,
  post_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "post",
    required: true,
  },
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true,
  },
  content: String,
});

module.exports = mongoose.model("Comment", commentSchema)
