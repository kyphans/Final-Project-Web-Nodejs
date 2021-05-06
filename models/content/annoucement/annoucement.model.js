const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const annoucementSchema = new Schema({
  type: String,
  title: String,
  created_at: Date,
  modified_at: Date,
  user_id: String,
  content: String,
  attachments: [
    {
      type: String,
      url: String,
    },
  ],
  categories_id: String,
});

module.exports = mongoose.model("Annoucement", annoucementSchema);
