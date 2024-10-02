import { Box, Chip, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import { MatchProfileView, Message, MessageState } from "../../../../../types/matchProfile";
import TextDisplay from "../../../../common/forms/textInputs/TextDisplay";
import MatchView from "./MatchView";
import { useState } from "react";



interface ViewMatchesProps {
  menteeUID: string
  menteeProfileId: string
  matchProfiles: MatchProfileView[]
}

function ViewMatches({ menteeUID, menteeProfileId, matchProfiles }: ViewMatchesProps) {
  const [profiles, setProfiles] = useState<MatchProfileView[]>(matchProfiles);

  const onReport = (mentorUID: string) => {
    const refreshProfiles = Array.of<MatchProfileView>();
    profiles.forEach(profile => {
      console.log(profile)
      if (profile.mentorProfile.data.UID !== mentorUID) {
        refreshProfiles.push(profile);
      }
    });
    setProfiles(refreshProfiles);
  }

  return (
    <Box paddingTop={5}>
      {profiles.length !== 0 &&
        <List>
          {profiles.map((profile, index) => (
            <MatchView profile={profile} 
              menteeUID={menteeUID} 
              menteeProfileId={menteeProfileId} 
              index={index} 
              profileCount={profiles.length}
              onReport={onReport}
            />
          ))}
        </List>
      }
      {(profiles.length === undefined || profiles.length === 0) &&
        <TextDisplay>No matches found</TextDisplay>
      }
    </Box>
  );
}

export default ViewMatches;