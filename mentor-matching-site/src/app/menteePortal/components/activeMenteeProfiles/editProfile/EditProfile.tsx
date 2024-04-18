import { MatchProfile } from "../../../../../types/matchProfile";
import { DocItem } from "../../../../../types/types";
import ModalWrapper from "../../../../common/forms/modals/ModalWrapper";
import ProfileForm, { ProfileFormData } from "../../../../common/forms/modals/ProfileForm";
import { useState } from "react";

interface EditProfileProps {
  matchProfile: DocItem<MatchProfile>
}

function EditProfile({ matchProfile }: EditProfileProps) {
  const [open, isOpen] = useState(true);
  const updateProfile = async (updatedProfile: ProfileFormData) => { }

  return (
    <ModalWrapper open={open} setIsOpen={isOpen}>
      <ProfileForm initialProfileFormData={matchProfile.data} onSubmit={updateProfile} />
    </ModalWrapper>
  )
}

export default EditProfile;