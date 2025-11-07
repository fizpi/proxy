import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.options('*', cors()); 

// ✅ Root endpoint (GET)
app.get('/', async (req, res) => {
  return res.json({
    status: 'Success',
    message: 'Proxy server running',
  });
});

// ✅ Proxy endpoint
app.post('/proxy', async (req, res) => {
  try {
    const { url, method = 'GET', body } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const fetchOptions = method === 'GET'
      ? {}
      : {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        };

    const response = await fetch(url, fetchOptions);
    const data = await response.text();

    return res.status(response.status).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ✅ 404 handler
app.use((req, res) => {
  return res.status(404).json({
    status: 'Error',
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 3000;

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Proxy running locally on port ${PORT}`));
}
