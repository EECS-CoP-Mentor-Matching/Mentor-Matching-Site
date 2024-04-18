import { Box, Chip, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import { MatchProfileView, Message, MessageState } from "../../../../../types/matchProfile";
import TextDisplay from "../../../../common/forms/textInputs/TextDisplay";
import MatchView from "./MatchView";



interface ViewMatchesProps {
  menteeUID: string
  menteeProfileId: string
  matchProfiles: MatchProfileView[]
}

function ViewMatches({ menteeUID, menteeProfileId, matchProfiles }: ViewMatchesProps) {

  return (
    <Box paddingTop={5}>
      {matchProfiles.length !== 0 &&
        <List>
          {matchProfiles.map((profile, index) => (
            <MatchView profile={profile} 
              menteeUID={menteeUID} 
              menteeProfileId={menteeProfileId} 
              index={index} 
              profileCount={matchProfiles.length} 
            />
          ))}
        </List>
      }
      {(matchProfiles.length === undefined || matchProfiles.length === 0) &&
        <TextDisplay>No matches found</TextDisplay>
      }
    </Box>
  );
}

export default ViewMatches;