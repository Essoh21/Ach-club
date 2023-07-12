const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const userSchema = new Schema({
  userInfo: { type: Schema.Types.ObjectId, ref: "UserInfo", required: true },
  pseudo: { type: String, required: true, maxLength: 15, minLength: 4 },
  password: { type: String, required: true },
  isMember: { type: Boolean, required: true, default: false },
  isAdmin: { type: Boolean, required: true, default: false },
  adminTrials: { type: Number, default: 0 },
  isAuthenticatedAdmin: { type: Boolean, required: true, default: false },
  avatar: { type: String, required: true, default: "/images/thinking.jpg" },
});
userSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

//incrypt password before saving when password is set or modified
userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("password")) next();
    //if password is modified
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

//add a method to check if user has a correct password
userSchema.methods.hasCorrectPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
