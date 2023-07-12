const mongoose = require("mongoose");
const AdminModel = require("../model/AdminModel");
const bcrypt = require("bcryptjs");
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const mongdbURI = process.env.MONGODB_URI;
//connect to mongodb
main()
  .then(console.log("successfull connection to db"))
  .catch((error) => console.log("error connection to database", error));
async function main() {
  await mongoose.connect(mongdbURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
}

//create admin pass hash and save it to db
const saveHash = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  console.log("------hash--" + hash);
  const adminModelDoc = new AdminModel({
    adminPass: hash,
  });
  // save doc to db
  try {
    await adminModelDoc.save();
    console.log("successful save ");
  } catch (e) {
    throw new Error("doc not saved----error----" + e);
  }
};

saveHash(process.env.ADMIN_PASS);
//save admin pass hash
