import React, {useState} from 'react';
import ContentContainer from "./ContentContainer";
import {Box, Button, FormControl, Grid, InputLabel, MenuItem, Select} from "@mui/material";

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
};

function CreateProfile() {
    const [personalInterest, setPersonalInterest] = useState('');
    const [personalExperience, setPersonalExperience] = useState('');
    const [technicalInterest, setTechnicalInterest] = useState('');
    const [technicalExperience, setTechnicalExperience] = useState('');

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
        'Novice (0 - 1 years)',
        'Intermediate (1 - 3 years)',
        'Advanced (3 - 5 years)',
        'Expert (5+ years)'
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
                                {experienceOptions.map((option, index) => (
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                ))}
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
                                {experienceOptions.map((option, index) => (
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, maxWidth: 300 }}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </ContentContainer>
    );
}

export default CreateProfile;
