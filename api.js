const express = require("express");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const app = express();
app.use(express.json());

const API_KEY = "AIzaSyDtitcqFf1FM8l4wJ2TmIbdZgJvnrDX8fY";
const model = new ChatGoogleGenerativeAI({
  apiKey: API_KEY,
  modelName: "gemini-pro",
  maxOutputTokens: 2048,
});

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://Apratim:CnHvjAzAmqEYT8Lj@atlascluster.mz70pny.mongodb.net"
);

const qaSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const QA = mongoose.model("QA", qaSchema);
app.post("/question", async (req, res) => {
  const question = req.body.question;
  const response = await model.invoke([["user", question]]);
  const ans = response.lc_kwargs.content;
  const qa = new QA({ question: question, answer: ans });
    try {
      await qa.save();
      res.json({
        Prompt: question,
        Answer: ans,
      });
    } 
    catch (err) {
      console.error(err);
      res.status(500).send("Error saving to database");
    }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
