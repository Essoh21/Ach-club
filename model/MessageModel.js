const mongoose = require("mongoose");
const { DateTime } = require("luxon"); // to help formatting date objects
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  DateTime: { type: Date, default: Date.now },
});

// create virtuals

messageSchema.virtual("formatted_DateTime").get(function () {
  return DateTime.fromJSDate(this.DateTime).toLocaleString(
    DateTime.DATETIME_SHORT
  ); //  to format to  month date, year at hh:mm
});

messageSchema.virtual("url").get(function () {
  return `/user/${this._id}/message`;
});

const MessageModel = mongoose.model("MESSAGE", messageSchema);

module.exports = MessageModel;
