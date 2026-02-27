import { Box, Button, Chip, Divider, Typography, Card, CardContent } from "@mui/material";
import ContentContainer from "../ContentContainer";
import React, { useEffect, useState } from "react";
import authService from "../../../service/authService";
import menteeService from "../../../service/menteeService";
import { mentorService } from "../../../service/mentorService";
import { DocItem } from "../../../types/types";
import { MatchProfile } from "../../../types/matchProfile";
import LoadingMessage from "../forms/modals/LoadingMessage";
import DeleteButton from "../forms/buttons/DeleteButton";
import EditButton from "../forms/buttons/EditButton";
import EditProfile from "./EditProfile";
import AddIcon from '@mui/icons-material/Add';

interface ActiveProfilesProps {
    userType: 'mentee' | 'mentor';
    onCreateProfile: () => void;
    backToPage?: () => any;
}

function ActiveProfiles({ userType, onCreateProfile, backToPage }: ActiveProfilesProps) {
    const [profiles, setProfiles] = useState<DocItem<MatchProfile>[]>([]);
    const [loadingProfiles, setLoadingProfiles] = useState(false);
    const [editingProfile, setEditingProfile] = useState<DocItem<MatchProfile>>();
    const [editing, setEditing] = useState(false);

    // Get appropriate service based on userType
    const service = userType === 'mentee' ? menteeService : mentorService;

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoadingProfiles(true);
            const user = await authService.getSignedInUser();
            if (user) {
                try {
                    const result = userType === 'mentee' 
                        ? await menteeService.searchMenteeProfilesByUser(user.uid)
                        : await mentorService.searchMentorProfilesByUser(user.uid);
                    
                    if (result !== undefined && result?.length !== 0) {
                        setProfiles(result);
                    }
                } catch (error) {
                    console.error(`Error fetching ${userType} profiles:`, error);
                }
            }
            setLoadingProfiles(false);
        };
        fetchProfiles();
    }, [userType]);

    const deleteProfile = async (profileId: string) => {
        setLoadingProfiles(true);
        
        if (userType === 'mentee') {
            await menteeService.deleteMenteeProfileById(profileId);
        } else {
            await mentorService.deleteMentorProfile(profileId);
        }
        
        const updatedProfiles = profiles.filter(profile => profile.docId !== profileId);
        setProfiles(updatedProfiles);
        setLoadingProfiles(false);
    }

    const editProfile = (profile: DocItem<MatchProfile>) => {
        setEditingProfile(profile);
        setEditing(true);
    }

    const updateProfileState = (updatedProfile: DocItem<MatchProfile>) => {
        const updatedProfiles = profiles.map(profile => 
            profile.docId === updatedProfile.docId ? updatedProfile : profile
        );
        setProfiles(updatedProfiles);
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
    }

    const getWeightColor = (weight: number): string => {
        const colors = {
            0: '#9ca3af',
            1: '#e879f9',
            2: '#c084fc',
            3: '#fb923c',
            4: '#fbbf24',
            5: '#22c55e'
        };
        return colors[weight as keyof typeof colors] || '#9ca3af';
    }

    return (
        <>
            <ContentContainer title="Active Profiles">
                <LoadingMessage loading={loadingProfiles} message="Loading profiles..." />

                <Box display='flex' flexDirection='column' gap={2}>
                    {/* Create Profile Button */}
                    {profiles.length > 0 && (
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
                    )}

                    <Box display='flex' gap={5}>
                        <Box sx={{ flex: 1 }}>
                            {profiles.map((profile, index) => (
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

                                        {/* Elevator Pitch / About Me */}
                                        {profile.data.aboutMe && profile.data.aboutMe.trim() && (
                                            <Box sx={{ mb: 2, p: 2, bgcolor: '#f9fafb', borderRadius: 1, border: '1px solid #e5e7eb' }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#555' }}>
                                                    {userType === 'mentee' ? 'Elevator Pitch' : 'About Me'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6 }}>
                                                    {profile.data.aboutMe}
                                                </Typography>
                                            </Box>
                                        )}

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

                                        {/* Mentorship Goal (Mentee only) */}
                                        {userType === 'mentee' && profile.data.mentorshipGoal && (
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
                            {profiles.length === 0 && (
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
                                        Create your first profile to start {userType === 'mentee' ? 'finding mentors' : 'mentoring students'}!
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
                        {editingProfile !== undefined && (
                            <EditProfile 
                                matchProfile={editingProfile} 
                                updateProfileState={updateProfileState} 
                                editing={editing} 
                                setEditing={setEditing}
                                userType={userType}
                                service={service}
                            />
                        )}
                    </Box>
                </Box>
            </ContentContainer>
        </>
    );
}

export default ActiveProfiles;
