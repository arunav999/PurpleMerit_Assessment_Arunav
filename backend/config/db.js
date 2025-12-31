// const mongoose = require("mongoose");

// async function PurpleMeritDB() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("PurpleMerit DB Connected");
//   } catch (err) {
//     console.log("Error connecting PurpleMeritDb:", err);
//     process.exit(1);
//   }
// }

// module.exports = PurpleMeritDB;

const mongoose = require("mongoose");

const PurpleMeritDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Using existing DB connection");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    });

    console.log("PurpleMerit DB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);

    throw new Error("DB Connection Failed");
  }
};

module.exports = PurpleMeritDB;
