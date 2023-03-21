import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Working fine',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      temperature: 0, //higher tempereature values means the model will take more risks. This is usueful in areas involving creative tasks
      max_tokens: 3000, //max number of characters to generate upon request
      top_p: 1,
      frequency_penalty: 0.5, // this reduces the chance of the model repeating the same sentence often especially when asked the same question over and over again
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});

app.listen(5000, () =>
  console.log('server is running on port http://localhost:5000')
);
