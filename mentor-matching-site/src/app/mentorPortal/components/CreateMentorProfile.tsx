import React, { useEffect, useState } from 'react';
import ContentContainer from "../../common/ContentContainer";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { mentorService } from "../../../service/mentorService";
import { ExperienceLevel, MatchProfile } from "../../../types/matchProfile";
import authService from "../../../service/authService";
import { interestsService } from "../../../service/interestsService";

function CreateMentorProfile() {
    const [technicalInterestOptions, setTechnicalInterestOptions] = useState<string[]>([]);
    const [technicalInterest, setTechnicalInterest] = useState('');
    const [technicalExperience, setTechnicalExperience] = useState('');

    const [professionalInterestOptions, setProfessionalInterestOptions] = useState<string[]>([]);
    const [professionalInterest, setProfessionalInterest] = useState('');
    const [professionalExperience, setProfessionalExperience] = useState('');

    const [experienceLevelOptions, setExperienceLevelOptions] = useState<ExperienceLevel[]>([]);

    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const fetchTechnicalInterests = async () => {
            try {
                const interests = await interestsService.getTechnicalInterests();
                const combinedInterests = interests.flatMap(interest =>
                    [interest.data.broadInterest, ...interest.data.specificInterests]
                );
                setTechnicalInterestOptions(combinedInterests);
            } catch (error) {
                console.error("Error fetching technical interests:", error);
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
                console.error("Error fetching professional interests:", error);
            }
        };

        const fetchExperienceLevels = async () => {
            try {
                let experienceLevels = await interestsService.getExperienceLevels();

                experienceLevels = experienceLevels.sort((a, b) => a.data.hierarchy - b.data.hierarchy);

                setExperienceLevelOptions(experienceLevels.map(x => x.data));
            } catch (error) {
                console.error("Error fetching experience levels:", error);
            }
        };

        fetchTechnicalInterests();
        fetchProfessionalInterests();
        fetchExperienceLevels();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const user = await authService.getSignedInUser();
        if (user) {
            const matchFormData: MatchProfile = {
                UID: user.uid,
                technicalInterest,
                technicalExperience: Number(technicalExperience),
                professionalInterest: professionalInterest,
                professionalExperience: Number(professionalExperience)
            };

            try {
                const response = await mentorService.createMentorProfile(matchFormData);
                setStatusMessage(response.success ? "Successfully created profile" : response.error as string);
            } catch (error) {
                setStatusMessage("An error occurred while creating the profile: " + error);
            }
        } else {
            setStatusMessage("Error authenticating user");
        }
    };

    return (
        <ContentContainer
            title="Mentor Profile"
            subtitle="Add your preferences to match with mentees"
        >
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
                            <InputLabel>Experience Level</InputLabel>
                            <Select
                                value={technicalExperience}
                                label="Experience Level"
                                onChange={(e) => setTechnicalExperience(e.target.value)}
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
                            <InputLabel>Experience Level</InputLabel>
                            <Select
                                value={professionalExperience}
                                label="Experience Level"
                                onChange={(e) => setProfessionalExperience(e.target.value)}
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

                        {statusMessage && (
                            <Typography color="primary.light" sx={{ mt: 2 }}>
                                {statusMessage}
                            </Typography>
                        )}
                    </Grid>

                </Grid>
            </Box>
        </ContentContainer>
    );
}

export default CreateMentorProfile;
