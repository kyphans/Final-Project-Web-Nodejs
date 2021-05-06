const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    type: String,
    role: String,
    department_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "department",
    },
    username: String,
    email: {
      type:String,
      unique: true
  },
    password: String,
    
    name: String,
    faculty: String,
    class_name: String,
    profile_picture: String,
    categories: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", userSchema);
