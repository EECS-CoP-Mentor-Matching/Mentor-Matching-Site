import { Box, Button, Chip, Divider, FormGroup, FormLabel, Grid, List, ListItem, ListItemText, Paper, TextField } from "@mui/material";
import ContentContainer from "../../../common/ContentContainer";
import React, { useEffect, useState } from "react";
import authService from "../../../../service/authService";
import menteeService from "../../../../service/menteeService";
import { DocItem } from "../../../../types/types";
import { MatchProfile } from "../../../../types/matchProfile";
import LoadingMessage from "../../../common/forms/modals/LoadingMessage";
import DeleteButton from "../../../common/forms/buttons/DeleteButton";
import EditButton from "../../../common/forms/buttons/EditButton";
import { MenuOpen } from "@mui/icons-material";
import ViewMatchesButton from "./ViewMatchesButton";

function ActiveMenteeProfiles() {
  const [menteeProfiles, setMenteeProfiles] = useState<DocItem<MatchProfile>[]>([]);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    fetchProfiles();
    setLoading(false);
  }, []);

  const deleteProfile = async (profileId: string) => {
    setLoading(true);
    await menteeService.deleteMenteeProfileById(profileId);
    const profiles = new Array<DocItem<MatchProfile>>();
    menteeProfiles.forEach(profile => {
      if (profileId !== profile.docId) profiles.push(profile);
    });
    setMenteeProfiles(profiles);
    setLoading(false);
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
      <LoadingMessage message="Loading Profiles..." loading={loading} />
      <ContentContainer
        title="Active Profiles"
      >
        <Box>
          <List>
            {menteeProfiles.map((profile, index) => (
              <React.Fragment key={profile.docId}>
                <Paper elevation={2} style={{ ...profileItemStyle }}>
                  <ListItem sx={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
                    <Box gap={2} display="flex" alignItems="center" justifyContent='space-between' width='100%'>
                      <ListItemText primary={`Profile #${index + 1}`} />
                      <EditButton />
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
                    <ViewMatchesButton />
                  </ListItem>
                  {index < menteeProfiles.length - 1 && <Divider />}
                </Paper>
              </React.Fragment>
            ))}
          </List>
        </Box>
      </ContentContainer>
    </>
  );
}

export default ActiveMenteeProfiles;