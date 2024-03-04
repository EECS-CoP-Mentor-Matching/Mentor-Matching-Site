import { Box, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import ContentContainer from "../../../common/ContentContainer";
import React, { useEffect, useState } from "react";
import authService from "../../../../service/authService";
import menteeService from "../../../../service/menteeService";
import { DocItem } from "../../../../types/types";
import { MatchProfile } from "../../../../types/matchProfile";
import WarningButton from "../../../common/forms/WarningButton";
import SubmitButton from "../../../common/forms/SubmitButton";
import LoadingMessage from "../../../common/forms/modals/LoadingMessage";

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
    width: '80%',
    maxWidth: '700px',
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
                  <ListItem>
                    <ListItemText
                      primary={`Profile ID: ${profile.docId}`}
                      secondary={`
                      Technical Interest: ${profile.data.technicalInterest} (${profile.data.technicalExperience} years), 
                      Professional Interest: ${profile.data.professionalInterest} (${profile.data.professionalExperience} years)
                    `}
                    />
                  </ListItem>
                  {index < menteeProfiles.length - 1 && <Divider />}
                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <WarningButton text="Delete Profile" onClick={() => { deleteProfile(profile.docId); }} />
                  </Box>
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