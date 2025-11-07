import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  return res.json({
    status: 'Success',
    message: 'Proxy server running',
  });
})

app.post('/proxy', async (req, res) => {
  const url = req.body.url;
  const method = req.body.method;
  const body = req.body.body;
  if (method=='GET') {
    const response = await fetch(url);
    const data = await response.text();
    return res.status(response.status).send(data);
  } else {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.text();
    return res.status(response.status).send(data);
  }
  
});

app.use((req, res) => {
  return res.status(404).json({
    status: 'Error',
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));