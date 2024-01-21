import React, { useState } from 'react';
import ContentContainer from "../../common/ContentContainer";
import {Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {mentorService} from "../../../service/mentorService";
import {MatchProfile} from "../../../types";
import authService from "../../../service/authService";

function CreateMentorProfile() {
    const [personalInterest, setPersonalInterest] = useState('');
    const [personalExperience, setPersonalExperience] = useState('');
    const [technicalInterest, setTechnicalInterest] = useState('');
    const [technicalExperience, setTechnicalExperience] = useState('');

    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const user = await authService.getSignedInUser();
        if (user) {
            const matchFormData: MatchProfile = {
                UID: user.uid,
                technicalInterest,
                technicalExperience: Number(technicalExperience),
                professionalInterest: personalInterest,
                professionalExperience: Number(personalExperience)
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

    const technicalInterestOptions = [
        '.NET',
        'Software Engineering',
        'Electrical Engineering',
        'AutoCAD'
    ];
    const personalInterestOptions = [
        'Resume',
        'Interviews',
        'Job Applications'
    ];
    const experienceOptions = [
        { label: 'Novice (0 - 1 years)', value: 1 },
        { label: 'Intermediate (1 - 3 years)', value: 2 },
        { label: 'Advanced (3 - 5 years)', value: 3 },
        { label: 'Expert (5+ years)', value: 4 }
    ];

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
                                    experienceOptions.map((option, index) => (
                                        <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Personal Interests</InputLabel>
                            <Select
                                value={personalInterest}
                                label="Personal Interests"
                                onChange={(e) => setPersonalInterest(e.target.value)}
                            >
                                {personalInterestOptions.map((option, index) => (
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Experience Level</InputLabel>
                            <Select
                                value={personalExperience}
                                label="Experience Level"
                                onChange={(e) => setPersonalExperience(e.target.value)}
                            >
                                {
                                    experienceOptions.map((option, index) => (
                                        <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
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
