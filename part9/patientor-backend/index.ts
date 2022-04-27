import express from 'express';
const app = express();
import cors from 'cors';
import api from './routes/api';

app.use(express.json());
app.use(cors());

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.use('/api', api);

const PORT = 3001;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
