import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import './ViewMatches.css';

interface ViewMatchesButtonProps {
  onClick?: () => void
}

function ViewMatchesButton({ onClick }: ViewMatchesButtonProps) {
  return (
    <button className='view-matches-button' onClick={onClick}>
      View Matches <ArrowForwardIos />
    </button>
  );
}

export default ViewMatchesButton;