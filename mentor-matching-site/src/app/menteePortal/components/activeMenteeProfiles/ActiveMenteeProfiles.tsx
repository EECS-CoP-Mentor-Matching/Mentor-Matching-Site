import { Box, Button, Chip, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import ContentContainer from "../../../common/ContentContainer";
import React, { useEffect, useState } from "react";
import authService from "../../../../service/authService";
import menteeService from "../../../../service/menteeService";
import { DocItem } from "../../../../types/types";
import { MatchProfile, MatchProfileView, MessageState } from "../../../../types/matchProfile";
import LoadingMessage from "../../../common/forms/modals/LoadingMessage";
import DeleteButton from "../../../common/forms/buttons/DeleteButton";
import EditButton from "../../../common/forms/buttons/EditButton";
import ViewMatchesButton from "./components/ViewMatchesButton";
import ViewMatches from "./components/ViewMatches";
import userService from "../../../../service/userService";
import matchingService from "../../../../service/matchingService"; // Updated to use the new service
import EditProfile from "./components/EditProfile";
import { messagingService } from "../../../../service/messagingService";
import { collection, getDocs, query, where } from 'firebase/firestore'; // Added for direct fetching
import { db } from '../../../../firebaseConfig'; // Added for direct fetching

interface ActiveMenteeProfilesProps {
    backToPage: () => any
}

function ActiveMenteeProfiles({ backToPage }: ActiveMenteeProfilesProps) {
    const [menteeProfiles, setMenteeProfiles] = useState<DocItem<MatchProfile>[]>([]);
    const [loadingProfiles, setLoadingProfiles] = useState(false);
    const [matches, setMatches] = useState<MatchProfileView[] | undefined>()
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [editingProfile, setEditingProfile] = useState<DocItem<MatchProfile>>();
    const [editing, setEditing] = useState(false);
    const [userID, setUserID] = useState("");
    const [menteeProfileId, setMenteeProfileId] = useState("");

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoadingProfiles(true);
            const user = await authService.getSignedInUser();
            if (user) {
                try {
                    const result = await menteeService.searchMenteeProfilesByUser(user.uid);
                    setUserID(user.uid);
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

    const checkMessages = async (matchProfiles: DocItem<MatchProfile>[], menteeProfileId: string) => {
        let matchProfileViews = [] as MatchProfileView[];
        for (const profile of matchProfiles) {
            const messages = await messagingService.getMessagesSentForMenteeProfile(profile.docId, menteeProfileId);
            let messageState = MessageState.replyReceived;
            if (messages.length !== 0) {
                messageState = MessageState.awaitingReply;
            }
            else {
                messageState = MessageState.noMessagesSent;
            }
            matchProfileViews.push({
                mentorProfile: profile,
                messageState: messageState
            } as MatchProfileView);
        }

        return matchProfileViews;
    }

    const showMatches = async (matchProfile: DocItem<MatchProfile>) => {
        setLoadingMatches(true);
        const currentUser = await authService.getSignedInUser();
        
        if (currentUser) {
            try {
                const menteeData = matchProfile.data as MatchProfile;

                // 1. Fetch all active mentor profiles (Matches logic in FindMatches)
                const mentorProfilesQuery = query(
                    collection(db, 'mentorProfile'),
                    where('isActive', '==', true)
                );
                
                const mentorSnapshot = await getDocs(mentorProfilesQuery);
                const allMentors: MatchProfile[] = [];
                
                mentorSnapshot.forEach(doc => {
                    const data = doc.data() as MatchProfile;
                    // Skip 'self' matches and ensure the mentor has the new fields
                    if (data.careerFields && data.weights && data.UID !== currentUser.uid) {
                        allMentors.push(data);
                    }
                });

                // 2. Use the revamped matching algorithm
                // Threshold set to 10% to show all viable connections
                const calculatedMatches = await matchingService.findMentorMatches(
                    menteeData,
                    allMentors,
                    10
                );

                // 3. Format for ViewMatches and check message history
                const formattedForCheck = calculatedMatches.map(m => ({
                    docId: m.userId, 
                    data: m.profile as MatchProfile
                }));

                const finalMatchViews = await checkMessages(formattedForCheck, matchProfile.docId);
                
                setMatches(finalMatchViews);
                setMenteeProfileId(matchProfile.docId);
            } catch (error) {
                console.error("Error calculating matches in Active Portal:", error);
            }
        }
        setLoadingMatches(false);
    }

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

    const profileItemStyle = {
        border: '1px solid #e0e0e0',
        margin: '10px 0',
        padding: '10px',
        borderRadius: '4px',
        marginLeft: 'auto',
        marginRight: 'auto'
    };

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

    return (
        <>
            <LoadingMessage message="Loading Profiles..." loading={loadingProfiles} />
            <LoadingMessage message="Loading Matches..." loading={loadingMatches} />
            <ContentContainer title="Active Profiles" >
                <Box display='flex' gap={5}>
                    <List>
                        {menteeProfiles.map((profile, index) => (
                            <React.Fragment key={profile.docId}>
                                <Paper elevation={2} style={{ ...profileItemStyle }}>
                                    <ListItem sx={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
                                        <Box display='flex' alignItems='center' width='100%' justifyContent='flex-end'>
                                            <ListItemText primary={`Profile #${index + 1}`} />
                                            <ViewMatchesButton onClick={() => { showMatches(profile); }} />
                                        </Box>
                                        <Box gap={2} display="flex" alignItems="center" justifyContent='flex-start' width='100%'>
                                            <EditButton onClick={() => { editProfile(profile); }} />
                                            <DeleteButton onClick={() => { deleteProfile(profile.docId); }} />
                                        </Box>

                                        {/* Technical Interests Chips (Handles both array and legacy fallback) */}
                                        <ListItemText secondary={"Technical Interests"} />
                                        <Box gap={1} display="flex" flexWrap="wrap" paddingLeft='15px' >
                                            {profile.data.technicalInterests?.map((interest) => (
                                                <Chip key={interest} label={interest} color="primary" size="small" />
                                            )) || <Chip label={profile.data.technicalInterest} color="primary" size="small" />}
                                            <Chip label={`${profile.data.technicalExperience} years`} variant="outlined" size="small" />
                                        </Box>

                                        {/* Career Fields Chips (Handles both array and legacy fallback) */}
                                        <ListItemText secondary={"Career Fields"} />
                                        <Box gap={1} display="flex" flexWrap="wrap" paddingLeft='15px' paddingBottom='10px'>
                                            {profile.data.careerFields?.map((field) => (
                                                <Chip key={field} label={field} color="secondary" size="small" />
                                            )) || <Chip label={profile.data.professionalInterest} color="secondary" size="small" />}
                                            <Chip label={`${profile.data.professionalExperience} years`} variant="outlined" size="small" />
                                        </Box>
                                    </ListItem>
                                    {index < menteeProfiles.length - 1 && <Divider />}
                                </Paper>
                            </React.Fragment>
                        ))}
                    </List>
                    {matches !== undefined &&
                        <ViewMatches matchProfiles={matches} menteeUID={userID} menteeProfileId={menteeProfileId} />
                    }
                    {editingProfile !== undefined &&
                        <EditProfile matchProfile={editingProfile} updateProfileState={updateProfileState} editing={editing} setEditing={setEditing} />
                    }
                    {menteeProfiles.length === 0 && <Box display="flex" flexDirection="column">
                        <p>No profiles found. Please create a new profile!</p>
                        <Button onClick={backToPage}>Create Profile</Button>
                    </Box>}
                </Box>
            </ContentContainer>
        </>
    );
}

export default ActiveMenteeProfiles;