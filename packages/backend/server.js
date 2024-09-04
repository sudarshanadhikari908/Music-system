const express = require('express');
const app = express();

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});
app.get('/my-api', (req, res) => {
  res.json({ message: 'Hello start your journey' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend is running on port ${PORT}`));