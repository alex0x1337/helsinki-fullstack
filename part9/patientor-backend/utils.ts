import { BaseEntry, Diagnose, Entry, Gender, HealthCheckRating, NewPatient } from "./types";

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};
const isArray = (data: unknown): data is Array<unknown> => {
    return data instanceof Array;
};
const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

export const parseId = (id: unknown): string => {
    if (!id || !isString(id)) {
      throw new Error('Incorrect or missing id');
    }
    return id;
};

const parseString = (field: unknown, errorField: string): string => {
    if (!field || !isString(field)) {
      throw new Error(`Incorrect or missing ${errorField}`);
    }
    return field;
};

const parseName = (name: unknown): string => parseString(name, 'name');

const parseDate = (date: unknown): string => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date: ' + date);
    }
    return date;
};

const  parseSSN = (ssn: unknown): string => parseString(ssn, 'ssn');

const parseOccupation = (occupation: unknown): string => parseString(occupation, 'occupation');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
    if (!gender || !isGender(gender)) {
        throw new Error('Incorrect or missing gender: ' + gender);
    }
    return gender;
};

const parseDiagnosisCodes = (codes: unknown): Array<Diagnose['code']> => {
    if (!codes) {
        return [];
    }
    if(!isArray(codes)) {
        throw new Error('Incorrect entries');
    }
    return codes.map((obj: unknown) => parseString(obj, 'code'));
};

const parseHealthCheckRating = (healthCheckRating: HealthCheckRating) => {
    if(!Object.values(HealthCheckRating).includes(healthCheckRating)) {
        throw new Error('Incorrect healthCheckRating : '+healthCheckRating);
    }
    return healthCheckRating;
};

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toEntry = (obj: any): Entry => {
    const _entry : BaseEntry = {
        id: parseId(obj.id),
        description: parseString(obj.description, 'description'),
        date: parseDate(obj.date),
        specialist: parseString(obj.specialist, 'specialist'),
        diagnosisCodes: parseDiagnosisCodes(obj.diagnosisCodes)
    };
    const entry: Entry = obj as Entry;
    switch(entry.type) {
        case "Hospital":
            return { ..._entry,
                type: entry.type,
                discharge: {
                    criteria: parseString(entry.discharge.criteria, 'discharge criteria'),
                    date: parseDate(entry.discharge.date)
                }
            };
        case "OccupationalHealthcare":
            return { ..._entry,
                type: entry.type,
                employerName: parseString(entry.employerName, 'employer name'),
                sickLeave: entry.sickLeave ? {
                    startDate: parseDate(entry.sickLeave?.startDate),
                    endDate: parseDate(entry.sickLeave?.endDate)
                } : undefined
            };
        case "HealthCheck":
            return { ..._entry,
                type: entry.type,
                healthCheckRating: parseHealthCheckRating(entry.healthCheckRating)
            };
        default:
            assertNever(entry);

    }
    return entry;
};

const parseEntries = (entries: unknown): Entry[] => {
    if(!entries) {
        return [];
    }
    if(!isArray(entries)) {
        throw new Error('Incorrect entries');
    }
    return entries.map((obj: unknown) => toEntry(obj));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewPatient = (object: any): NewPatient => {
    const newPatient: NewPatient = {
        name: parseName(object.name),
        dateOfBirth: parseDate(object.dateOfBirth),
        ssn: parseSSN(object.ssn),
        gender: parseGender(object.gender),
        entries: parseEntries(object.entries),
        occupation: parseOccupation(object.occupation)
    };
    return newPatient;
};
