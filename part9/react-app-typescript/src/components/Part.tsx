import { CoursePart } from "../types"

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const Part = ({ part } : { part: CoursePart } ) => {
    switch(part.type) {
        case "normal":
            return <>
                <h2>{part.name} {part.exerciseCount}</h2>
                <p>{part.description}</p>
            </>
        case "groupProject":
            return <>
                <h2>{part.name} {part.exerciseCount}</h2>
                <p>project exercises {part.groupProjectCount}</p>
            </>
        case "submission":
            return <>
                <h2>{part.name} {part.exerciseCount}</h2>
                <p>{part.description}</p>
                <p>submit to {part.exerciseSubmissionLink}</p>
            </>
        case "special":
            return <>
                <h2>{part.name} {part.exerciseCount}</h2>
                <p>{part.description}</p>
                <p>required skills: {part.requirements.reduce((prev, requirement) => (prev === "" ? "" : prev + ", ")+requirement, "")}</p>
            </>
        default:
            return assertNever(part);
    }
}

export default Part