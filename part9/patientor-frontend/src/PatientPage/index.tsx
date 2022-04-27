import axios from "axios";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { addPatient, updatePatient, useStateValue } from "../state";
import { Entry, Patient } from "../types";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import EntryDetails from "../components/EntryDetails";
import { EntryFormValues } from "../AddPatientModal/AddPatientEntryForm";
import AddPatientEntryModal from "../AddPatientModal/AddPatientEntryModal";
import { Button } from "@mui/material";


const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const PatientPage = () => {
    const { id } = useParams<{ id: string }>();
    const [{ patients, diagnosisCodes }, dispatch] = useStateValue();
    const navigate = useNavigate();
    const getPatient = async (id : string) => {
        const { data: patient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        dispatch(updatePatient(patient));
    };
    useEffect(() => {
        if(!isString(id)) {
            navigate('/');
            return;
        }
        if(!(patients[id]?.ssn)) {
            void getPatient(id);
        }
    }, [dispatch]);

    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>();
  
    const openModal = (): void => setModalOpen(true);
  
    const closeModal = (): void => {
      setModalOpen(false);
      setError(undefined);
    };
    if(!isString(id)) {
        return <></>;
    }
    const patient = patients[id];
    if(!patient) {
        return <></>;
    }
    const submitNewEntry = async (values: EntryFormValues) => {

        console.log(values);
        try {
            const { data: newPatient } = await axios.post<Patient>(
              `${apiBaseUrl}/patients/${id}/entries`,
              values
            );
            dispatch(addPatient(newPatient));
            closeModal();
          } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
              console.error(e?.response?.data || "Unrecognized axios error");
              setError(String(e?.response?.data?.error) || "Unrecognized axios error");
            } else {
              console.error("Unknown error", e);
              setError("Unknown error");
            }
          }
        return;
    };
    return <Box>
        <Typography variant="h3" style={{ marginBottom: "0.5em", marginTop: "0.5em" }}>
            {patient.name} {
            patient.gender === 'male' ? <MaleIcon /> :
            patient.gender === 'female' ? <FemaleIcon /> :
            patient.gender === 'other' ? <TransgenderIcon /> :
            ''
            }
        </Typography>
        ssn: {patient.ssn}
        <br />
        occupation: {patient.occupation}

        <Typography variant="h4" style={{ marginBottom: "0.5em", marginTop: "0.5em" }}>
            entries
        </Typography>

        <AddPatientEntryModal
            modalOpen={modalOpen}
            onSubmit={submitNewEntry}
            error={error}
            onClose={closeModal}
        />
        <Button variant="contained" onClick={() => openModal()}>
            Add New Entry
        </Button>
        <div>
            {patient.entries.map((entry: Entry, key: number) => (
            <div key={key} style={{border: '1px solid', padding: 15, borderRadius: 20, margin: 10}}>
                <h5>{entry.date} {entry.description}</h5>
                diagnose by {entry.specialist}<br /><br />
                <EntryDetails entry={entry} />
                <ul>
                    {entry.diagnosisCodes?.map((code: string, key2: number) => (
                        <li key={key.toString()+"-"+key2.toString()}>{code + ' '}{
                            diagnosisCodes.find(diagnosis => diagnosis.code === code) ?
                                diagnosisCodes.find(diagnosis => diagnosis.code === code)?.name
                                : ''
                            }
                        </li>
                    ))}
                </ul>
            </div>
            ))}
        </div>
    </Box>;
};

export default PatientPage;