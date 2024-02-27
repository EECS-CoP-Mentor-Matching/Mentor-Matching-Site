import React, { useState, useEffect } from 'react';
import {
	Box,
	Button,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	CircularProgress
} from '@mui/material';
import {ExperienceLevel} from "../../../../types/matchProfile";
import {interestsService} from "../../../../service/interestsService";

export interface ProfileFormData {
	technicalInterest: string;
	technicalExperience: number;
	professionalInterest: string;
	professionalExperience: number;
}
interface ProfileFormProps {
	onSubmit: (profileFormData: ProfileFormData) => void;
	initialProfileFormData? : ProfileFormData;
}
const ProfileForm : React.FC<ProfileFormProps> = ({
						 onSubmit,
						 initialProfileFormData
					 }) => {
	const [valuesLoading, setValuesLoading] = useState<boolean>(true);
	const [technicalInterestOptions, setTechnicalInterestOptions] = useState<string[]>([]);
	const [technicalInterest, setTechnicalInterest] = useState('');
	const [technicalExperience, setTechnicalExperience] = useState(-1);

	const [professionalInterestOptions, setProfessionalInterestOptions] = useState<string[]>([]);
	const [professionalInterest, setProfessionalInterest] = useState('');
	const [professionalExperience, setProfessionalExperience] = useState(-1);
	const [experienceLevelOptions, setExperienceLevelOptions] = useState<ExperienceLevel[]>([]);

	useEffect(() => {
		const fetchTechnicalInterests = async () => {
			try {
				const interests = await interestsService.getTechnicalInterests();
				const combinedInterests = interests.flatMap(interest =>
					[interest.data.broadInterest, ...interest.data.specificInterests]
				);
				setTechnicalInterestOptions(combinedInterests);
			} catch (error) {
				console.error("Error fetching technical interests: ", error);
			}
		};
		const fetchProfessionalInterests = async () => {
			try {
				const interests = await interestsService.getProfessionalInterests();
				const combinedInterests = interests.flatMap(interest =>
					[interest.data.professionalInterest]
				)
				setProfessionalInterestOptions(combinedInterests);
			} catch (error) {
				console.error("Error fetching professional interests: ", error);
			}
		};

		const fetchExperienceLevels = async () => {
			try {
				let experienceLevels = await interestsService.getExperienceLevels();

				experienceLevels = experienceLevels.sort((a, b) => a.data.hierarchy - b.data.hierarchy);

				setExperienceLevelOptions(experienceLevels.map(x => x.data));
			} catch (error) {
				console.error("Error fetching experience levels: ", error);
			}
		};

		const fetchValues = async () => {
			try {
				setValuesLoading(true);

				await fetchTechnicalInterests();
				await fetchProfessionalInterests();
				await fetchExperienceLevels();

				setValuesLoading(false);
			} catch (error) {
				console.error("Error updating form values: ", error);
			}
		};

		void fetchValues();
	}, []);

	useEffect(() => {
		if (!valuesLoading && initialProfileFormData) {
			setTechnicalInterest(initialProfileFormData?.technicalInterest as string);
			setTechnicalExperience(initialProfileFormData?.technicalExperience as number);
			setProfessionalInterest(initialProfileFormData?.professionalInterest as string);
			setProfessionalExperience(initialProfileFormData?.professionalExperience as number);
		}
	}, [valuesLoading, initialProfileFormData]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const profileFormData: ProfileFormData = {
			technicalInterest,
			technicalExperience,
			professionalInterest,
			professionalExperience,
		};
		onSubmit(profileFormData);
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			noValidate
			sx={{
				pt: 3,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				maxWidth: 800,
				margin: 'auto'
			}}
		>
			{valuesLoading ? (
				<CircularProgress />
			) : (
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<FormControl fullWidth margin="normal">
						<InputLabel>Technical Interests</InputLabel>
						<Select
							value={technicalInterest}
							label="Technical Interests"
							onChange={(e) => setTechnicalInterest(e.target.value)}
						>
							{technicalInterestOptions.map((option, index) => (
								<MenuItem key={index} value={option}>{option}</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} md={6}>
					<FormControl fullWidth margin="normal">
						<InputLabel>Technical Experience Level</InputLabel>
						<Select
							value={technicalExperience >= 0 ? technicalExperience : ''}
							label="Technical Experience Level"
							onChange={(e) => setTechnicalExperience(Number(e.target.value))}
						>
							{
								experienceLevelOptions.map((option, index) => (
									<MenuItem key={index} value={option.hierarchy}>{option.level}</MenuItem>
								))
							}
						</Select>
					</FormControl>
				</Grid>

				<Grid item xs={12} md={6}>
					<FormControl fullWidth margin="normal">
						<InputLabel>Professional Interests</InputLabel>
						<Select
							value={professionalInterest}
							label="Professional Interests"
							onChange={(e) => setProfessionalInterest(e.target.value)}
						>
							{professionalInterestOptions.map((option, index) => (
								<MenuItem key={index} value={option}>{option}</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} md={6}>
					<FormControl fullWidth margin="normal">
						<InputLabel>Professional Experience Level</InputLabel>
						<Select
							value={professionalExperience >= 0 ? professionalExperience : ''}
							label="Professional Experience Level"
							onChange={(e) => setProfessionalExperience(Number(e.target.value))}
						>
							{
								experienceLevelOptions.map((option, index) => (
									<MenuItem key={index} value={option.hierarchy}>{option.level}</MenuItem>
								))
							}
						</Select>
					</FormControl>
				</Grid>

				<Grid item xs={12}>
					<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, maxWidth: 300 }}>
						Submit
					</Button>
				</Grid>

			</Grid>
			)}
		</Box>
	);
};

export default ProfileForm;