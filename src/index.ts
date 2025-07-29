import express from 'express';

const app = express();
const PORT = 3000;

// @ts-ignore
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 