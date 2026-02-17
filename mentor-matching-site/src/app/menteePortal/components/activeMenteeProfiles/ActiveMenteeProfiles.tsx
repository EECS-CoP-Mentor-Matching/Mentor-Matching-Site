import { Box, Button, Chip, Divider, List, ListItem, ListItemText, Paper, Typography, Card, CardContent } from "@mui/material";
import ContentContainer from "../../../common/ContentContainer";
import React, { useEffect, useState } from "react";
import authService from "../../../../service/authService";
import menteeService from "../../../../service/menteeService";
import { DocItem } from "../../../../types/types";
import { MatchProfile, MatchProfileView, MessageState } from "../../../../types/matchProfile";
import LoadingMessage from "../../../common/forms/modals/LoadingMessage";
import DeleteButton from "../../../common/forms/buttons/DeleteButton";
import EditButton from "../../../common/forms/buttons/EditButton";
import EditProfile from "./components/EditProfile";
import AddIcon from '@mui/icons-material/Add';

interface ActiveMenteeProfilesProps {
    backToPage: () => any;
    onCreateProfile: () => void;
}

function ActiveMenteeProfiles({ backToPage, onCreateProfile }: ActiveMenteeProfilesProps) {
    const [menteeProfiles, setMenteeProfiles] = useState<DocItem<MatchProfile>[]>([]);
    const [loadingProfiles, setLoadingProfiles] = useState(false);
    const [editingProfile, setEditingProfile] = useState<DocItem<MatchProfile>>();
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoadingProfiles(true);
            const user = await authService.getSignedInUser();
            if (user) {
                try {
                    const result = await menteeService.searchMenteeProfilesByUser(user.uid);
                    if (result !== undefined && result?.length !== 0) {
                        setMenteeProfiles(result);
                    }
                } catch (error) {
                    console.error("Error fetching mentee profiles:", error);
                }
            }
            setLoadingProfiles(false);
        };
        fetchProfiles();
    }, []);

    const deleteProfile = async (profileId: string) => {
        setLoadingProfiles(true);
        await menteeService.deleteMenteeProfileById(profileId);
        const profiles = new Array<DocItem<MatchProfile>>();
        menteeProfiles.forEach(profile => {
            if (profileId !== profile.docId) profiles.push(profile);
        });
        setMenteeProfiles(profiles);
        setLoadingProfiles(false);
    }

    const editProfile = (profile: DocItem<MatchProfile>) => {
        setEditingProfile(profile);
        setEditing(true);
    }

    const updateProfileState = (updatedProfile: DocItem<MatchProfile>) => {
        const updatedProfiles = Array<DocItem<MatchProfile>>();
        menteeProfiles.forEach(profile => {
            if (profile.docId == updatedProfile.docId) {
                updatedProfiles.push(updatedProfile);
            }
            else {
                updatedProfiles.push(profile);
            }
        });
        setMenteeProfiles(updatedProfiles);
    }

    const getWeightLabel = (weight: number): string => {
        switch(weight) {
            case 1: return 'Not Important';
            case 2: return 'Slightly Important';
            case 3: return 'Moderately Important';
            case 4: return 'Very Important';
            case 5: return 'Extremely Important';
            default: return 'Not Set';
        }
    };

    const getWeightColor = (weight: number): string => {
        switch(weight) {
            case 5: return '#22c55e'; // Green - Extremely Important
            case 4: return '#eab308'; // Yellow - Very Important (brighter!)
            case 3: return '#14b8a6'; // Teal - Moderately Important (middle)
            case 2: return '#9333ea'; // Purple - Slightly Important
            case 1: return '#6b7280'; // Gray - Not Important
            default: return '#6b7280';
        }
    };

    return (
        <>
            <LoadingMessage message="Loading Profiles..." loading={loadingProfiles} />
            <ContentContainer title="Active Profiles">
                {/* Create New Profile Button */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={onCreateProfile}
                        sx={{ 
                            backgroundColor: '#0066cc',
                            '&:hover': { backgroundColor: '#0052a3' }
                        }}
                    >
                        Create New Profile
                    </Button>
                </Box>

                <Box display='flex' gap={5}>
                    <Box sx={{ flex: 1 }}>
                        {menteeProfiles.map((profile, index) => (
                            <Card key={profile.docId} sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
                                <CardContent>
                                    {/* Header with Created Date and Actions */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Box>
                                            {profile.data.introduction && profile.data.introduction.trim() && (
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0066cc' }}>
                                                    {profile.data.introduction}
                                                </Typography>
                                            )}
                                            {profile.data.createdAt && (
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                    Created on {(() => {
                                                        const date = profile.data.createdAt;
                                                        // Handle Firestore Timestamp
                                                        const jsDate = date?.toDate ? date.toDate() : new Date(date);
                                                        return jsDate.toLocaleDateString('en-US', { 
                                                            month: 'long', 
                                                            day: 'numeric', 
                                                            year: 'numeric',
                                                            hour: 'numeric',
                                                            minute: '2-digit'
                                                        });
                                                    })()}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <EditButton onClick={() => editProfile(profile)} />
                                            <DeleteButton onClick={() => deleteProfile(profile.docId)} />
                                        </Box>
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    {/* Career Fields */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#555' }}>
                                            Career Fields
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {profile.data.careerFields?.map((field) => (
                                                <Chip key={field} label={field} color="primary" size="small" />
                                            )) || <Chip label={profile.data.professionalInterest} color="primary" size="small" />}
                                        </Box>
                                    </Box>

                                    {/* Technical Interests */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#555' }}>
                                            Technical Interests
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {profile.data.technicalInterests?.map((interest) => (
                                                <Chip key={interest} label={interest} size="small" sx={{ bgcolor: '#e3f2fd' }} />
                                            )) || <Chip label={profile.data.technicalInterest} size="small" sx={{ bgcolor: '#e3f2fd' }} />}
                                        </Box>
                                    </Box>

                                    {/* Life Experiences */}
                                    {profile.data.lifeExperiences && profile.data.lifeExperiences.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#555' }}>
                                                Life Experiences
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                {profile.data.lifeExperiences.map((exp) => (
                                                    <Chip key={exp} label={exp} size="small" variant="outlined" />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Languages */}
                                    {profile.data.languages && profile.data.languages.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#555' }}>
                                                Languages
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                {profile.data.languages.map((lang) => (
                                                    <Chip key={lang} label={lang} size="small" variant="outlined" color="secondary" />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Mentorship Goal */}
                                    {profile.data.mentorshipGoal && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#555' }}>
                                                Mentorship Goal
                                            </Typography>
                                            <Typography variant="body2">{profile.data.mentorshipGoal}</Typography>
                                        </Box>
                                    )}

                                    {/* Matching Preferences (Weights) */}
                                    {profile.data.weights && (
                                        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#555' }}>
                                                Matching Preferences
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Career & Technical:</Typography>
                                                    <Typography variant="body2" sx={{ 
                                                        fontWeight: 600,
                                                        color: getWeightColor(profile.data.weights.technicalInterests)
                                                    }}>
                                                        {getWeightLabel(profile.data.weights.technicalInterests)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Life Experiences:</Typography>
                                                    <Typography variant="body2" sx={{ 
                                                        fontWeight: 600,
                                                        color: getWeightColor(profile.data.weights.lifeExperiences)
                                                    }}>
                                                        {getWeightLabel(profile.data.weights.lifeExperiences)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Languages:</Typography>
                                                    <Typography variant="body2" sx={{ 
                                                        fontWeight: 600,
                                                        color: getWeightColor(profile.data.weights.languages)
                                                    }}>
                                                        {getWeightLabel(profile.data.weights.languages)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        ))}

                        {/* No Profiles State */}
                        {menteeProfiles.length === 0 && (
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: 2,
                                p: 4,
                                bgcolor: '#f5f5f5',
                                borderRadius: 2
                            }}>
                                <Typography variant="h6" color="text.secondary">
                                    No profiles found
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Create your first profile to start finding mentors!
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    startIcon={<AddIcon />}
                                    onClick={onCreateProfile}
                                    sx={{ 
                                        backgroundColor: '#0066cc',
                                        '&:hover': { backgroundColor: '#0052a3' }
                                    }}
                                >
                                    Create Profile
                                </Button>
                            </Box>
                        )}
                    </Box>

                    {/* Edit Profile Panel */}
                    {editingProfile !== undefined &&
                        <EditProfile 
                            matchProfile={editingProfile} 
                            updateProfileState={updateProfileState} 
                            editing={editing} 
                            setEditing={setEditing} 
                        />
                    }
                </Box>
            </ContentContainer>
        </>
    );
}

export default ActiveMenteeProfiles;
