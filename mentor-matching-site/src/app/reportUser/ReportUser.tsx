import { useState } from "react";
import ReportUserModal from "./ReportUserModal";
import SubmitButton from "../common/forms/buttons/SubmitButton";
import WarningButton from "../common/forms/buttons/WarningButton";
import { IconButton } from "@mui/material";
import { Flag } from "@mui/icons-material";

interface ReportUserProps {
  reportedForUID: string
  onReport?: (reportedForUID: string) => void
}

function ReportUser({ reportedForUID, onReport }: ReportUserProps) {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <WarningButton text="" onClick={() => {setShowModal(!showModal);}} widthMulti={.01}>
        <Flag sx={{ height: '1rem', width: '1rem' }} />
      </WarningButton>
      <ReportUserModal onReport={onReport} reportedForUID={reportedForUID} showModal={showModal} setIsOpen={setShowModal} />
    </>

  );
}

export default ReportUser;