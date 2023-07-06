const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userInfo: { type: Schema.Types.ObjectId, ref: "userInfo", required: true },
  password: { type: String, required: true },
});

userSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
