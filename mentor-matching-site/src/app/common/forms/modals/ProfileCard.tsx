import React from 'react';
import { Box, Chip, IconButton, Paper, Typography, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {DocItem} from "../../../../types/types";
import {MatchProfile} from "../../../../types/matchProfile";

interface ProfileCardProps {
	profile: DocItem<MatchProfile>,
	onEdit: (event : React.MouseEvent<HTMLElement>) => void,
	onDelete: (event : React.MouseEvent<HTMLElement>) => void
}
const ProfileCard = ({
						 profile,
						 onEdit,
						 onDelete
					 } : ProfileCardProps) => {

	const profileItemStyle = {
		border: '1px solid #e0e0e0',
		margin: '10px 0',
		padding: '20px',
		borderRadius: '8px',
		width: '90%',
		maxWidth: '700px',
		marginLeft: 'auto',
		marginRight: 'auto',
		transition: '0.3s',
		height: '250px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		'&:hover': {
			backgroundColor: '#f3f3f3',
		},
	};

	const manageButtonStyle = {
		transition: '0.3s',
		'&:hover': {
			backgroundColor: 'rgba(87,135,180,0.3)',
		}
	}

	return (
		<Paper elevation={2} sx={{ position: 'relative', ...profileItemStyle }}>
			<Box sx={{ padding: 3, textAlign: 'left', overflow: 'hidden' }}> {}
				<Typography variant="subtitle2" gutterBottom noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
					Profile ID: {profile.docId}
				</Typography>
				<Box marginBottom={1}>
					<Typography variant="body2" gutterBottom>
						<strong>Technical Interest:</strong>
					</Typography>
					<Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
						<Chip label={profile.data.technicalInterest} color="primary" />
						<Chip label={`${profile.data.technicalExperience} years`} variant="outlined" />
					</Box>
				</Box>
				<Box marginTop={1}>
					<Typography variant="body2" gutterBottom>
						<strong>Professional Interest:</strong>
					</Typography>
					<Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
						<Chip label={profile.data.professionalInterest} color="secondary" />
						<Chip label={`${profile.data.professionalExperience} years`} variant="outlined" />
					</Box>
				</Box>
			</Box>
			<Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 1 }}>
				<IconButton
					onClick={onEdit}
					size="large"
					sx={manageButtonStyle}
				>
					<EditIcon />
				</IconButton>
				<IconButton
					onClick={onDelete}
					size="large"
					sx={manageButtonStyle}
				>
					<DeleteIcon />
				</IconButton>
			</Box>
		</Paper>
	);
};

export default ProfileCard;