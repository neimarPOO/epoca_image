require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// Read the prompt generation rules
const promptRules = fs.readFileSync(path.join(__dirname, '..', '..', 'epoca_imagens.txt'), 'utf-8');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Function to generate the detailed prompt by calling a text model
async function generateDetailedPrompt(epoch, openRouterKey) {
  const metaPrompt = `
    ${promptRules}

    Based on the rules above, generate the JSON object for the following epoch: "${epoch}".
    The user's image will be provided in the next step. Focus on creating the detailed prompt and related fields based on the epoch's characteristics.
  `;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openRouterKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "openrouter/auto", // Use a powerful text model to generate the prompt
      "messages": [
        { "role": "user", "content": metaPrompt }
      ]
    })
  });

  const data = await response.json();
  if (!response.ok || !data.choices || data.choices.length === 0) {
    console.error('Failed to generate detailed prompt:', data);
    throw new Error('Could not generate the detailed prompt.');
  }

  // The model should return the JSON object as a string in the content
  const jsonString = data.choices[0].message.content;
  try {
    // The model might return the JSON inside a code block, so we need to extract it.
    const jsonMatch = jsonString.match(/```json\n([\s\S]*?)\n```/);
    const extractedJson = jsonMatch ? jsonMatch[1] : jsonString;
    return JSON.parse(extractedJson);
  } catch (e) {
    console.error("Failed to parse JSON from prompt generation response:", e);
    console.error("Raw response was:", jsonString);
    throw new Error("Could not parse the detailed prompt JSON.");
  }
}


app.post('/api/generate-image', async (req, res) => {
  const { imageUrl, epoch } = req.body;
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'OpenRouter API key is not configured on the server.' });
  }

  try {
    // Step 1: Generate the detailed prompt and parameters using a text model
    const promptData = await generateDetailedPrompt(epoch, OPENROUTER_API_KEY);
    const imagePrompt = promptData.prompt_imagem;

    if (!imagePrompt) {
      throw new Error("The generated prompt data did not contain a 'prompt_imagem' field.");
    }

    // Step 2: Use the generated prompt to create the image
    const imageResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-flash-image-preview:free",
        "messages": [
          {
            "role": "user",
            "content": [
              { "type": "text", "text": imagePrompt },
              { "type": "image_url", "image_url": { "url": imageUrl } }
            ]
          }
        ]
      })
    });

    const imageData = await imageResponse.json();
    
    // Add a check to see if the response contains the expected image data
    if (!imageData.choices || !imageData.choices[0].message.images || !imageData.choices[0].message.images[0].image_url.url) {
        console.error('Invalid response from image generation API:', imageData);
        // Also log what the promptData was for debugging
        console.error('Prompt data used:', promptData);
        throw new Error('Image generation API did not return an image in the expected format.');
    }

    res.json(imageData);

  } catch (error) {
    console.error('Error in image generation process:', error);
    res.status(500).json({ error: error.message || 'Failed to generate image' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});