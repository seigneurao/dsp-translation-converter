import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3000;
const ENDPOINT = "/download"
const CROWDIN_URL = "https://crowdin.com/backend/download/project/dyson-sphere-program/";

app.use(cors());

app.use(express.static('public'));

app.get(ENDPOINT, async (req, res) => {
  const translationUrl = `${CROWDIN_URL}${req.query.locale}.zip`;

  try {
    const response = await fetch(translationUrl);

    // Check if the response status is okay (2xx)
    if (!response.ok) {
      console.error(`Download error: ${response.status}`);
      res.status(response.status).send('Download Error');
      return;
    }

    // Send the proper Content-Type header
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Access-Control-Allow-Origin', '*')
    
    // Pipe the response directly to the client
    response.body.pipe(res);

  } catch (error) {
    console.error(`Download error: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});