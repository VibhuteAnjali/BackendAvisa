import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = 3000;

// eslint-disable-next-line no-undef
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function runDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    return client.db("testdb");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

app.use(bodyParser.json());
app.use(cors()); // Add this line to use CORS

app.post("/contactUs", async (req, res) => {
  const { name, email, message, date } = req.body;
  try {
    const database = client.db("DigiAvisaTech");
    const collection = database.collection("ContactUs");
    const result = await collection.insertOne({ name, email, message, date });
    res
      .status(200)
      .json({ message: "User added successfully", userId: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding user", error });
  }
});
app.post("/newsLetter", async (req, res) => {
  const { email, date, ip } = req.body;
  try {
    const database = client.db("DigiAvisaTech");
    const collection = database.collection("NewsLetter");
    const result = await collection.insertOne({ email, date, ip });
    res
      .status(200)
      .json({ message: "User added successfully", userId: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding user", error });
  }
});
app.get("/", (req, res) => {
  res.send(" welcome Backend digi Avisa!");
});
app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await runDB();
});
