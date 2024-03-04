import { Box, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import ContentContainer from "../../../common/ContentContainer";
import React, { useEffect, useState } from "react";
import authService from "../../../../service/authService";
import menteeService from "../../../../service/menteeService";
import { DocItem } from "../../../../types/types";
import { MatchProfile } from "../../../../types/matchProfile";
import WarningButton from "../../../common/forms/WarningButton";
import SubmitButton from "../../../common/forms/SubmitButton";

function ActiveMenteeProfiles() {
  const [mentorProfiles, setMentorProfiles] = useState<DocItem<MatchProfile>[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const user = await authService.getSignedInUser();
      if (user) {
        try {
          const result = await menteeService.searchMenteeProfilesByUser(user.uid);
          if (result !== undefined) {
            setMentorProfiles(result);
          }
          else {
            setMentorProfiles(new Array<DocItem<MatchProfile>>());
          }
        } catch (error) {
          console.error("Error fetching mentee profiles:", error);
        }
      }
    };
    fetchProfiles();
  }, []);

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
    <ContentContainer
      title="Active Profiles"
    >
      <Box>
        <List>
          {mentorProfiles.map((profile, index) => (
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
                {index < mentorProfiles.length - 1 && <Divider />}
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                  <SubmitButton text="View Matches" />
                  <WarningButton text="Delete Profile" />
                </Box>
              </Paper>
            </React.Fragment>
          ))}
        </List>
      </Box>
    </ContentContainer>
  );
}

export default ActiveMenteeProfiles;