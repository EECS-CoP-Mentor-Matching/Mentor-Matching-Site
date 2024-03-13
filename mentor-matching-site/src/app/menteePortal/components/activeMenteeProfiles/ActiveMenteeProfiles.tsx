import { Box, Chip, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import ContentContainer from "../../../common/ContentContainer";
import React, { useEffect, useState } from "react";
import authService from "../../../../service/authService";
import menteeService from "../../../../service/menteeService";
import { DocItem } from "../../../../types/types";
import { MatchProfile, initMatchProfile } from "../../../../types/matchProfile";
import LoadingMessage from "../../../common/forms/modals/LoadingMessage";
import DeleteButton from "../../../common/forms/buttons/DeleteButton";
import EditButton from "../../../common/forms/buttons/EditButton";
import ViewMatchesButton from "./ViewMatchesButton";
import ViewMatches from "./viewMatches/ViewMatches";
import userService from "../../../../service/userService";
import { mentorService } from "../../../../service/mentorService";
import EditProfile from "./editProfile/EditProfile";

function ActiveMenteeProfiles() {
  const [menteeProfiles, setMenteeProfiles] = useState<DocItem<MatchProfile>[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [matches, setMatches] = useState<DocItem<MatchProfile>[] | undefined>()
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [editingProfile, setEditingProfile] = useState<DocItem<MatchProfile>>();


  useEffect(() => {
    const fetchProfiles = async () => {
      const user = await authService.getSignedInUser();
      if (user) {
        try {
          const result = await menteeService.searchMenteeProfilesByUser(user.uid);
          if (result !== undefined) {
            setMenteeProfiles(result);
          }
          else {
            setMenteeProfiles(new Array<DocItem<MatchProfile>>());
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

  const showMatches = async (matchProfile: DocItem<MatchProfile>) => {
    setLoadingMatches(true);
    const currentUser = await authService.getSignedInUser();
    if (currentUser) {
      const profile = await userService.getUserProfile(currentUser.uid);
      const result = await mentorService.searchMentorsByProfileMatch(matchProfile.docId, profile);
      setMatches(result);
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
  }

  const profileItemStyle = {
    border: '1px solid #e0e0e0',
    margin: '10px 0',
    padding: '10px',
    borderRadius: '4px',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

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
            <ViewMatches mentorProfiles={matches} />
          }
          {editingProfile !== undefined &&
            <EditProfile matchProfile={editingProfile} />
          }
        </Box>
      </ContentContainer>
    </>
  );
}

export default ActiveMenteeProfiles;