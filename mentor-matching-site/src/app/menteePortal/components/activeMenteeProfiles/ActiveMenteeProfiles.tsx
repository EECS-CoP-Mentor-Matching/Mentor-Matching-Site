import { Box, Button, Chip, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import ContentContainer from "../../../common/ContentContainer";
import React, { useEffect, useState } from "react";
import authService from "../../../../service/authService";
import menteeService from "../../../../service/menteeService";
import { DocItem } from "../../../../types/types";
import { MatchProfile, MatchProfileView, MessageState, initMatchProfile } from "../../../../types/matchProfile";
import LoadingMessage from "../../../common/forms/modals/LoadingMessage";
import DeleteButton from "../../../common/forms/buttons/DeleteButton";
import EditButton from "../../../common/forms/buttons/EditButton";
import ViewMatchesButton from "./components/ViewMatchesButton";
import ViewMatches from "./components/ViewMatches";
import userService from "../../../../service/userService";
import { mentorService } from "../../../../service/mentorService";
import EditProfile from "./components/EditProfile";
import { messagingService } from "../../../../service/messagingService";
import ReportUser from "../../../reportUser/ReportUser";

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
    };
    setLoadingProfiles(true);
    fetchProfiles();
    setLoadingProfiles(false);
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
      const profile = await userService.getUserProfile(currentUser.uid);
      const result = await mentorService.searchMentorsByProfileMatch(matchProfile.docId, profile);
      const matches = await checkMessages(result, matchProfile.docId);
      setMatches(matches);
      setMenteeProfileId(matchProfile.docId);
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
                    <ListItemText secondary={"Technical Interest"} />
                    <Box gap={2} display="flex" alignItems="center" paddingLeft='15px' >
                      <Chip label={profile.data.technicalInterest} color="primary" />
                      <Chip label={`${profile.data.technicalExperience} years`} variant="outlined" />
                    </Box>
                    <ListItemText secondary={"Professional Interest"} />
                    <Box gap={2} display="flex" alignItems="center" paddingLeft='15px' paddingBottom='10px'>
                      <Chip label={profile.data.professionalInterest} color="primary" />
                      <Chip label={`${profile.data.professionalExperience} years`} variant="outlined" />
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