import { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from "../types";
import { assertNever } from "../utils";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Hospital : React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
    return <>
    Hospital<br />
    Discharge: {entry.discharge.date} {entry.discharge.criteria}
    </>;
};

const OccupationalHealthcare : React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
    return <>
        employer: {entry.employerName}<br />
        {entry.sickLeave ? <>sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}</> : ''}
    </>;
};

const HealthCheck : React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
    return <>
    {[0, 1, 2, 3, 4].map(num => num <= 4 - entry.healthCheckRating ? <FavoriteIcon key={num} /> : <FavoriteBorderIcon key={num} />) }
    </>;
};


const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {

    switch(entry.type) {
        case "Hospital":
            return <Hospital entry={entry} />;
        case "OccupationalHealthcare":
            return <OccupationalHealthcare entry={entry} />;
        case "HealthCheck":
            return <HealthCheck entry={entry} />;
        default:
            assertNever(entry);
    }
    return <></>;
};


export default EntryDetails;
