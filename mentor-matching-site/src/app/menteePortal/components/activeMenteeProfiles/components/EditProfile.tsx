import menteeService from "../../../../../service/menteeService";
import { MatchProfile } from "../../../../../types/matchProfile";
import { DocItem } from "../../../../../types/types";
import ModalWrapper from "../../../../common/forms/modals/ModalWrapper";
import ProfileForm, { ProfileFormData } from "../../../../common/forms/modals/ProfileForm";
import { useState } from "react";

interface EditProfileProps {
  matchProfile: DocItem<MatchProfile>,
  updateProfileState: (profile: DocItem<MatchProfile>) => void
  editing: boolean
  setEditing: (editing: boolean) => void
}

function EditProfile({ matchProfile, updateProfileState, editing, setEditing }: EditProfileProps) {
  const updateProfile = async (updatedProfile: ProfileFormData) => {
    const updatedProfileDoc = {
      UID: matchProfile.data.UID,
      technicalInterest: updatedProfile.technicalInterest,
      technicalExperience: updatedProfile.technicalExperience,
      professionalInterest: updatedProfile.professionalInterest,
      professionalExperience: updatedProfile.professionalExperience 
    } as MatchProfile;

    await menteeService.updateMenteeProfile(updatedProfileDoc, matchProfile.docId);
    setEditing(false);
    updateProfileState({docId: matchProfile.docId, data: updatedProfileDoc});
  }

  return (
    <ModalWrapper open={editing} setIsOpen={setEditing}>
      <ProfileForm initialProfileFormData={matchProfile.data} onSubmit={updateProfile} />
    </ModalWrapper>
  )
}

export default EditProfile;