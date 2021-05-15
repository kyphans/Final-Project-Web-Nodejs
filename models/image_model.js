const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uploadSchema = new Schema(
  {
    link: String,
  }
);

module.exports = mongoose.model("Upload", uploadSchema);
