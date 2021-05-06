const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  type: String,
  like_count: Number,
  comment_count: Number,
  created_at: Date,
  modified_at: Date,
  user_id: String,
  attachments: [
    {
      type: String,
      url: String,
    },
  ],
  content: String
});

// const postSchema = new Schema({
//   type: String,
//   post_content_id: [{
//     type: mongoose.SchemaTypes.ObjectId,
//     ref: "post_detail",
//   }],
//   like_count: Number,
//   comment_count: Number,
//   created_at: Date,
//   modified_at: Date,
//   author: {
//     user_id: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: "user",
//     },
//   },
//   attachments: [
//     {
//       type: String,
//       url: String,
//     },
//   ],
// });

module.exports = mongoose.model("Post", postSchema);

