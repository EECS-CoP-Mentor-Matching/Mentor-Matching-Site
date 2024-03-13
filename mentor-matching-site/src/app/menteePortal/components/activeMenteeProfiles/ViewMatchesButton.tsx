import MenuOpen from '@mui/icons-material/MenuOpen';
import './ViewMatches.css';

interface ViewMatchesButtonProps {
  onClick?: () => void
}

function ViewMatchesButton({ onClick }: ViewMatchesButtonProps) {
  return (
    <button className='view-matches-button' onClick={onClick}>
      View Matches <MenuOpen />
    </button>
  );
}

export default ViewMatchesButton;