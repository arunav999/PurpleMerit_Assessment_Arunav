const mongoose = require("mongoose");

async function PurpleMeritDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("PurpleMerit DB Connected");
  } catch (err) {
    console.log("Error connecting PurpleMeritDb:", err);
    process.exit(1);
  }
}

module.exports = PurpleMeritDB;
