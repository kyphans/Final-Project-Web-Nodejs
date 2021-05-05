const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const annoucementSchema = new Schema({
  type: String,
  title: String,
  created_at: Date,
  modified_at: Date,
  author: {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  attachments: [
    {
      type: String,
      url: String,
    },
  ],
  categories: Array,
});

module.exports = mongoose.model("Annoucement", annoucementSchema);
