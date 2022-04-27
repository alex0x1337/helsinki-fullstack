import React from "react";
import { Rating } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { withStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

type BarProps = {
  rating: number;
  showText: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const StyledRating = withStyles({
  iconFilled: {
    color: "#ff6d75",
  },
  iconHover: {
    color: "#ff3d47",
  },
})(Rating);

const HEALTHBAR_TEXTS = [
  "The patient is in great shape",
  "The patient has a low risk of getting sick",
  "The patient has a high risk of getting sick",
  "The patient has a diagnosed condition",
];

const HealthRatingBar = ({ rating, showText }: BarProps) => {
  return (
    <div className="health-bar">
      <ThemeProvider theme={defaultTheme}>
        <StyledRating
          readOnly
          value={4 - rating}
          max={4}
          icon={<FavoriteIcon fontSize="inherit" />}
        />
        {showText ? <p>{HEALTHBAR_TEXTS[rating]}</p> : null}
      </ThemeProvider>
    </div>
  );
};

export default HealthRatingBar;
