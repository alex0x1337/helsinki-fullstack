
interface ExercisesResult {
    periodLength: number,
    trainingDays: number,
    target: number,
    average: number,
    success: boolean,
    rating: number,
    ratingDescription: string
}

export const calculateExercises = (exerciseHours: Array<number>, targetHours: number): ExercisesResult => {
    const average: number = exerciseHours.reduce((prev: number, current:number) => prev + current, 0) / exerciseHours.length;
    const rating: number = average > targetHours ? 3 : (average > 0.5 * targetHours) ? 2 : 1;
    const ratingDescriptions = [
        'try better next time',
        'not too bad but could be better',
        'good',
    ];
    return {
        periodLength: exerciseHours.length,
        trainingDays: exerciseHours.reduce((prev: number, current:number) => prev + (current > 0 ? 1 : 0), 0),
        target: targetHours,
        average: average,
        success: average >= targetHours,
        rating: rating,
        ratingDescription: ratingDescriptions[rating - 1]
    };
};

interface ParsedExercises {
    target: number;
    exercises: Array<number>;
}

const parseExercises = (args: Array<string>): ParsedExercises => {
    if (args.length < 4) throw new Error('Not enough arguments');
    const exercises: Array<number> = args.slice(2).map(value => Number(value));
    if(exercises.reduce((prev, current) => (prev || isNaN(current)), false)) {
        throw new Error('Provided values were not numbers!');
    }
    const target: number = exercises[0];
    return {
        target: target,
        exercises: exercises.slice(1)
    };
};

if (process.argv.length > 2) {
    const { target, exercises } = parseExercises(process.argv);
    console.log(calculateExercises(exercises, target));
}