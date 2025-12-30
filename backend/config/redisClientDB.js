const { createClient } = require("redis");
require("dotenv").config();

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on("error", (err) => {
  console.error(`Redis client error: ${err}`);
});

const connectReddis = async () => {
  try {
    await redisClient.connect();
    console.log("Purple Merit Redis DB Connected");
  } catch (error) {
    console.error(`Redis connection error: ${error}`);
    process.exit(1);
  }
};

module.exports = { redisClient, connectReddis };
