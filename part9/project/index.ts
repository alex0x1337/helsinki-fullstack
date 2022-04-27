import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});


app.get('/bmi', (req, res) => {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);
    if (!isNaN(height) && !isNaN(weight)) {
        res.json({
            weight: weight,
            height: height,
            bmi: calculateBmi(height, weight)
        });
    } else {
        res.json({ error: "malformatted parameters" }).status(400);
    }
});
 
app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment 
    const { daily_exercises, target } = req.body;
    if(!target || !daily_exercises) {
        res.json({ error: "parameters missing" }).status(400);
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exercises : Array<number> = (daily_exercises instanceof Array ? daily_exercises : []).map((value: any) => Number(value));
    if(isNaN(Number(target)) || !(daily_exercises instanceof Array) || exercises.reduce((prev : number, current : number) => (prev || isNaN(current)), false)) {
        res.json({ error: "malformatted parameters" }).status(400);
        return;
    }
    res.json(calculateExercises(exercises, Number(target)));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});