import express from 'express';
import diagnoses from '../data/diagnoses';
import patients from '../data/patients';
import { Entry, NewPatient, Patient } from '../types';
import { toNewPatient, parseId, toEntry } from '../utils';

const router = express.Router();


router.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});
  
router.get('/diagnoses', (_req, res) => {
    res.json(diagnoses);
});

router.get('/patients', (_req, res) => {
    res.json(patients.getPatientsPublic());
});

router.get('/patients/:id', (req, res) => {
    try {
        const id: string = parseId(req.params.id);
        const patient : Patient | undefined = patients.getPatientById(id);
        if(patient === undefined) {
            res.status(404).send('Patient not found');
            return;
        }
        res.json(patient);
    } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
    }
});

router.post('/patients/:id/entries', (req, res) => {
    try {
        const id: string = parseId(req.params.id);
        const patient : Patient | undefined = patients.getPatientById(id);
        if(patient === undefined) {
            res.status(404).send('Patient not found');
            return;
        }
        const entry: Entry = toEntry(req.body);
        patient.entries.push(entry);
        res.json(patient);
    } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
    }
});


router.post('/patients', (req, res) => {
    try {
        const newPatient: NewPatient = toNewPatient(req.body);
        const addedPatient = patients.addPatient(newPatient);
        res.json(addedPatient);
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      res.status(400).send(errorMessage);
    }
});


export default router;