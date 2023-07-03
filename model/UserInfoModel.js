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
});

//virutals
userInfoSchema.virtual("url").get(function () {
  return `${this._id}`;
});

const UserInfoModel = mongoose.model("UserInfo", userInfoSchema);
module.exports = UserInfoModel;
