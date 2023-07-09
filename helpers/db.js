require("dotenv").config(); // to put .env variables into process env
const port = process.env.PORT;
//connnect to db
const mongdbURI = process.env.MONGODB_URI;
main()
  .then(console.log("successfull connection to db"))
  .catch((error) => console.log("error connection to database", error));
async function main() {
  await mongoose.connect(mongdbURI);
}
