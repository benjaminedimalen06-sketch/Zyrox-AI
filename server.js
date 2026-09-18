const express = require('express');
const cors = require('cors');
const Replicate = require('replicate');

const app = express();
app.use(cors());
app.use(express.json());

// Ang key ay binabasa mula sa environment variable, hindi nakasulat sa code
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Proxy endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Palitan ito ng totoong model at version ng video generation
    const output = await replicate.run(
      "lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dd2e16dc8cc00d89130c1bae4ab8f00",
      {
        input: {
          prompt: prompt,
          // Iba pang parameters ayon sa dokumentasyon ng model
        }
      }
    );
    
    res.json({ success: true, videoUrl: output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => res.send('Zyrox Proxy is running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on ${PORT}`));
