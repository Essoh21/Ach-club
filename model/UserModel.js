const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userInfo: { type: Schema.Types.ObjectId, ref: "userInfo", required: true },
  pseudo: { type: String, required: true, maxLength: 15, minLength: 4 },
  password: { type: String, required: true },
});

userSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
