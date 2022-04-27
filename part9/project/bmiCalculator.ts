

export const calculateBmi = (height: number, weight: number): string => {
    const BMI: number = weight / ((height / 100) * (height / 100));
    if (BMI < 16.0) {
        return 'Underweight (Severe thinness)';
    } else if (BMI < 17) {
        return 'Underweight (Moderate thinness)';
    } else if (BMI < 18.5) {
        return 'Underweight (Mild thinness)';
    } else if (BMI < 25.0) {
        return 'Normal (Healthy weight)';
    } else if (BMI < 30.0) {
        return 'Overweight (Pre-obese)';
    } else if (BMI < 35.0) {
        return 'Obese (Class I)';
    } else if (BMI < 40.0) {
        return 'Obese (Class II)';
    } else {
        return 'Obese (Class III)';
    }
};

interface ParsedValues {
    height: number;
    weight: number;
}

export const parseArguments = (args: Array<string>): ParsedValues => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');
  
    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
      return {
        height: Number(args[2]),
        weight: Number(args[3])
      };
    } else {
      throw new Error('Provided values were not numbers!');
    }
};

if (process.argv.length > 2) {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
}
