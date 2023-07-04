const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    maxLength: [30, "first name must contain at most 30 characters"],
  },
  lastname: { type: String, required: true, maxLength: 30 },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        const emailRegex = /[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(email);
      },
      message: (props) => {
        `${props.email} is not a valid email adress!`;
      },
    },
  },
  confirmationCode: { type: Number, required: true },
  inputCode: { type: Number, default: 1 },
  trials: { type: Number, default: 0 },
});

//virutals
userInfoSchema.virtual("url").get(function () {
  return `${this._id}`;
});

userInfoSchema.virtual("hasConfirmedEmail").get(function () {
  return this.validationCode === this.inputCode ? true : false;
});

const UserInfoModel = mongoose.model("UserInfo", userInfoSchema);
module.exports = UserInfoModel;
