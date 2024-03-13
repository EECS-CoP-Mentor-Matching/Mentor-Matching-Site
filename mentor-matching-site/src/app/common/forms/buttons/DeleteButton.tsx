import DeleteIcon from '@mui/icons-material/Delete';

interface DeleteButtonProps {
  onClick?: () => void
}

function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button onClick={() => {
      if (onClick !== undefined) {
        onClick();
      }
    }} style={{
      background: 'none',
      backgroundColor: 'none',
      border: 'none',
      width: 'min-content'
    }}>
      <DeleteIcon sx={{
        fill: 'black',
        background: 'none',
        '&:hover': {
          fill: 'red',
          background: 'none'
        }
      }} />
    </button>
  );
}

export default DeleteButton;