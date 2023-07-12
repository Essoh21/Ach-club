const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema({
  adminPass: { type: String, required: true },
  name: { type: String, required: true, default: "AchAdmin" },
});

const AdminModel = mongoose.model("Admin", AdminSchema);
module.exports = AdminModel;
