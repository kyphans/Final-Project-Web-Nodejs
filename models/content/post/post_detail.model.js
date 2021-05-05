const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postDetailSchema = new Schema({
  type: String,
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
  },
  content: String,
});

module.exports = mongoose.model("PostDetail", postDetailSchema);
