import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 200,
  textAlign: 'center',
  boxShadow: theme.shadows[3], // <-- erro aqui se theme é undefined
}));

const InfoCard = ({ title, value, color }) => (
  <StyledCard sx={{ borderLeft: `5px solid ${color}` }}>
    <CardContent>
      <Typography variant="subtitle1" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </CardContent>
  </StyledCard>
);

export default InfoCard;
