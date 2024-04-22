import { Box } from "@mui/material";
import ModalWrapper from "../common/forms/modals/ModalWrapper";
import { useState } from "react";
import DropDownControl from "../common/forms/dropDowns/DropDownControl";
import { ReportUserReasons } from "../../types/matchProfile";
import { DropDownOption, UserReport } from "../../types/types";
import { useAppSelector } from "../../redux/hooks";
import SubmitButton from "../common/forms/buttons/SubmitButton";
import { reportUserService } from "../../service/reportUserService";
import { Timestamp } from "firebase/firestore";

interface ReportUserModalProps {
  reportedForUID: string,
  showModal: boolean
  setIsOpen: (open: boolean) => void
}

function createOption(label: string, id: string): DropDownOption {
  return {
    label: label,
    id: id
  } as DropDownOption
}

function ReportUserModal({ reportedForUID, showModal, setIsOpen }: ReportUserModalProps) {
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState<ReportUserReasons>(ReportUserReasons.notSelected);
  const selector = useAppSelector;
  const currentUserUID = selector(state => state.userProfile.userProfile.UID);

  const sendReport = async () => {
    if (message !== "" && reason !== ReportUserReasons.notSelected) {
      await reportUserService.reportUser({
        reportReason: reason.toString(),
        reportMessage: message,
        reportedByUID: currentUserUID,
        reportedForUID: reportedForUID,
        reportedOn: Timestamp.now()
      });
      setIsOpen(false);
    }
  }

  const options = [
    createOption("Suspicious Activity", ReportUserReasons.suspiciousActivity),
    createOption("Abusive Content", ReportUserReasons.abusiveContent),
    createOption("I Feel Uncomfortable", ReportUserReasons.iFeelUncomforatble),
    createOption("I Feel Unsafe", ReportUserReasons.iFeelUnsafe),
  ]

  return (
    <ModalWrapper open={showModal} setIsOpen={setIsOpen}>
      <Box display={'flex'} flexDirection={'column'} gap={'5px'} justifyContent={'center'} alignItems={'center'}>
        <DropDownControl
          label="Reason for Reporting"
          options={options}
          onSelect={setReason}
          selectedValue={"Suspicious Activity"}
          valueIs="label"
        />
        <textarea style={{ height: '250px', width: '250px' }}
          onChange={(e) => { setMessage(e.target.value) }}
        />
        <SubmitButton text="Send Report" onClick={sendReport} />
      </Box>
    </ModalWrapper>
  );
}

export default ReportUserModal