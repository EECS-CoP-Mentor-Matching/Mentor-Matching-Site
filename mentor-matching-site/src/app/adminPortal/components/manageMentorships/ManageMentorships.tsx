import { useEffect, useState } from "react";
import { Avatar, Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import matchDb from "../../../../dal/matchDb";
import userService from "../../../../service/userService";
import { Match } from "../../../../types/matchProfile";
import { UserProfile } from "../../../../types/userProfile";
import ContentContainer from "../../../common/ContentContainer";

interface EnrichedMatch extends Match {
  mentorProfile: UserProfile | null;
  menteeProfile: UserProfile | null;
}

function ManageMentorships() {
  const [matches, setMatches] = useState<EnrichedMatch[]>([]);

  useEffect(() => {
    const fetchMentorships = async () => {
      try {
        const allMatches = await matchDb.getAllMatchesAsync();
        const formattedMatches = await Promise.all(
          allMatches.map(async (m) => ({
            ...m,
            mentorProfile: await userService.getUserProfile(m.mentorId).catch(() => null),
            menteeProfile: await userService.getUserProfile(m.menteeId).catch(() => null),
          }))
        );
        setMatches(formattedMatches);
      } catch (error) {
        console.error("error fetching mentorships:", error);
      }
    };

    fetchMentorships();
  }, []);

  return (
    <ContentContainer
      title="Manage Mentorships"
      subtitle="A table of all mentorships"
    >
      <Box sx={{ paddingInline: { xs: "4px", md: "20%" }, paddingBlockStart: 2, paddingBottom: 6, overflowX: "auto" }}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Mentor</TableCell>
                <TableCell>Mentee</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Match %</TableCell>
                <TableCell>Matched On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.map((m) => (
                <TableRow key={m.matchId} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        src={m.mentorProfile?.profilePictureUrl || m.mentorProfile?.imageUrl}
                        sx={{ width: 30, height: 30 }}
                      />
                      <Link to={`/admin-portal/edit-user/${m.mentorId}`}>
                        {m.mentorProfile?.contact?.displayName || m.mentorId}
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        src={m.menteeProfile?.profilePictureUrl || m.menteeProfile?.imageUrl}
                        sx={{ width: 30, height: 30 }}
                      />
                      <Link to={`/admin-portal/edit-user/${m.menteeId}`}>
                        {m.menteeProfile?.contact?.displayName || m.menteeId}
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={m.status}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{m.matchPercentage}%</TableCell>
                  <TableCell>
                    {m.matchedAt?.toDate?.()?.toLocaleDateString() ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ContentContainer>
  );
}

export default ManageMentorships;
