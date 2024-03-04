const express = require('express');
const app = express();

// cors
const cors = require('cors');
app.use(cors()); 
// const corsOpt = {
//   origin: process.env.CORS_ALLOW_ORIGIN || '*', // this work well to configure origin url in the server
//   methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], // to works well with web app, OPTIONS is required
//   allowedHeaders: ['Content-Type', 'Authorization'] // allow json and token in the headers
// };
// app.use(cors(corsOpt)); // cors for all the routes of the application
// // automatic cors gen for HTTP verbs in all routes, This can be redundant but I kept to be sure that will always work.
// app.options('*', cors(corsOpt)); 

// router
const path = require('path');

// OPENAI
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// config
const bodyParser = require("body-parser");
app.use(express.json({ limit : "50mb" }));
app.use(express.urlencoded({ limit:"50mb", extended: false }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("views", "./views"); //화면 뷰를 관리해줄 폴더 경로 세팅
app.set("view engine", "ejs"); //view 엔진 ejs사용

require("dotenv").config();

//db
const mongoose = require('mongoose');
const dbName = 'FinancialCenter'
mongoose
.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB conected by Mongoose'))
.catch((err) => {
  console.log(err);
});


app.listen(process.env.PORT, () => {
  console.log(`${process.env.PORT} port on`);
});

const routes = require("./routes");
app.use(routes);


async function main() {

  const assistant_id = asst_dWzY54dGBv91b4rudTiCrrCP;

  const thread = await openai.beta.threads.create({
    messages: [
      {
        "role": "user",
        "content": "Create 3 data visualizations based on the trends in this file.",
        "file_ids": [file.id]
      }
    ]
  });
  
  
  const run = await openai.beta.threads.runs.create(
    thread.id,
    {
      assistant_id: assistant_id,
      model: "gpt-4-turbo-preview",
      instructions: "New instructions that override the Assistant instructions",
      tools: [{"type": "code_interpreter"}, {"type": "retrieval"}]
    }
  );
}
