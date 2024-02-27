import SelectExperienceLevel from "../../../matchProfileCommon/SelectExperienceLevel";
import "./CreateMenteeProfile.css";
import SelectProfessionalInterest from "../../../matchProfileCommon/SelectProfessionalInterest";
import SelectTechnicalInterest from "../../../matchProfileCommon/SelectTechnicalInterest";
import { FormLabel, Button } from "@mui/material";
import { updateNewMenteeProfileProfessionalExperience, updateNewMenteeProfileProfessionalInterest, updateNewMenteeProfileTechnicalExperience, updateNewMenteeProfileTechnicalInterest } from "../../../../redux/reducers/matchProfileReducer";
import { useAppSelector } from "../../../../redux/hooks";
import menteeDb from "../../../../dal/menteeDb";
import ErrorMessage, { ErrorState, parseError, resetError } from "../../../common/forms/ErrorMessage";
import { useState } from "react";
import { MatchProfile } from "../../../../types/matchProfile";
import authService from "../../../../service/authService";
import LoadingMessage from "../../../common/forms/modals/LoadingMessage";
import { nullNumber, nullString } from "../../../common/forms/validation";

interface CreateMenteeProfileProps {
  backToPage: () => any
}

function CreateMenteeProfile({ backToPage }: CreateMenteeProfileProps) {
  const [errorState, setErrorState] = useState<ErrorState>({ isError: false, errorMessage: '' });
  const [loading, setLoading] = useState(false);

  const selector = useAppSelector;
  const menteeProfile = selector(state => state.matchProfiles.newMenteeProfile);

  const createProfile = async () => {
    setErrorState(resetError());
    setLoading(true);
    try {
      validateInputs(menteeProfile);
      const user = await authService.getSignedInUser();
      const uid = user?.uid;
      const newProfile = {
        ...menteeProfile,
        UID: uid
      } as MatchProfile;
      await menteeDb.createMenteeProfileAsync(newProfile);
    }
    catch (error) {
      setErrorState(parseError(error));
    }
    setLoading(false);
    if (!errorState.isError) backToPage();
  }

  const validateInputs = (profile: MatchProfile) => {
    if (nullString(profile.technicalInterest)) {
      throw new Error("Select a techincal interest");
    }
    if (nullNumber(profile.technicalExperience)) {
      throw new Error("Select a techincal experience level");
    }
    if (nullString(profile.professionalInterest)) {
      throw new Error("Select a professional interest");
    }
    if (nullNumber(profile.professionalExperience)) {
      throw new Error("Select a professional experience level");
    }
  }

  return (
    <div className="mentee-profile">
      <LoadingMessage message="Creating new Profile..." loading={loading} />
      <FormLabel>Technical</FormLabel>
      <div className="mentee-interest">
        <SelectTechnicalInterest onSelectDispatch={updateNewMenteeProfileTechnicalInterest} />
        <SelectExperienceLevel onSelectDispatch={updateNewMenteeProfileTechnicalExperience} />
      </div>
      <FormLabel>Professional</FormLabel>
      <div className="mentee-interest">
        <SelectProfessionalInterest onSelectDispatch={updateNewMenteeProfileProfessionalInterest} />
        <SelectExperienceLevel onSelectDispatch={updateNewMenteeProfileProfessionalExperience} />
      </div>
      <Button onClick={createProfile}>Add Profile</Button>
      <ErrorMessage errorState={errorState} />
    </div>
  )
}

export default CreateMenteeProfile;