import EditIcon from '@mui/icons-material/Edit';

interface EditButtonProps {
  onClick?: () => void
}

function EditButton({ onClick }: EditButtonProps) {
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
      <EditIcon sx={{
        fill: 'black',
        background: 'none',
        '&:hover': {
          fill: 'darkgray',
          background: 'none'
        }
      }} />
    </button>
  );
}

export default EditButton;