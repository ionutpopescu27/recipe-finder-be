const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

 app.get('/api/getRecipes', async (req, res) => {
  
  const  query  = req.query.search;
  
  try {
    const aiResponse = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Provide a list of 5 recipes for "${query}". Each recipe should be in JSON format with the following fields: name, prepTime, ingredients (as an array), and instructions (as an array). Return only valid pure JSON format.`,
        },
      ],
    temperature: 0.0,
    max_tokens: 1500
    
});

    const textResponse = aiResponse.choices[0].message.content;
    const cleanedResponse = textResponse.replace(/```|json/g, '');
    const recipes = JSON.parse(cleanedResponse);
    res.json({ recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
