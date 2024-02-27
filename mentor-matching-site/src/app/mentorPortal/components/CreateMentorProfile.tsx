import React, { useState } from 'react';
import ContentContainer from "../../common/ContentContainer";
import { mentorService } from "../../../service/mentorService";
import { MatchProfile } from "../../../types/matchProfile";
import authService from "../../../service/authService";
import ProfileForm , {ProfileFormData} from "../../common/forms/modals/ProfileForm";
import PopupMessage from "../../common/forms/modals/PopupMessage";

function CreateMentorProfile() {
    const [popupText, setPopupText] = useState<string>("");
    const [showPopupModal, setShowPopupModal] = useState(false);
    const handleSubmit = async (profileFormData: ProfileFormData) => {
        const user = await authService.getSignedInUser();
        if (user) {
            const matchFormData: MatchProfile = {
                UID: user.uid,
                technicalInterest: profileFormData.technicalInterest,
                technicalExperience: profileFormData.technicalExperience,
                professionalInterest: profileFormData.professionalInterest,
                professionalExperience: profileFormData.professionalExperience
            };

            try {
                const response = await mentorService.createMentorProfile(matchFormData);
                setPopupText(response.success ? "Successfully created profile" : response.error as string);
            } catch (error) {
                setPopupText("An error occurred while creating the profile: " + error);
            }
        } else {
            setPopupText("Error authenticating user");
        }
        setShowPopupModal(true);
    };

    return (
        <ContentContainer
            title="Mentor Profile"
            subtitle="Add your preferences to match with mentees"
        >
            <PopupMessage message={popupText}
                          open={showPopupModal}
                          setIsOpen={setShowPopupModal} />
            <ProfileForm onSubmit={handleSubmit} />
        </ContentContainer>
    );
}

export default CreateMentorProfile;
