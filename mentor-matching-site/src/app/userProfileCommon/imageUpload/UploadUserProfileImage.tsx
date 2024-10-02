import React, { useState, useRef, LegacyRef } from 'react';
import userService from '../../../service/userService';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserProfile } from '../../../types/userProfile';
import { useAppDispatch } from '../../../redux/hooks'
import { updateUserProfileImage } from '../../../redux/reducers/userProfileReducer';
import { Button, FormGroup, FormLabel } from '@mui/material';
import "./UploadUserProfileImage.css"
import PopupMessage from '../../common/forms/modals/PopupMessage';
import { emptyProfileImage } from '../../../icons/icons';
// import { emptyProfile/ Remove the unused import statementImage } from '../../../icons/icons';

interface UploadUserProfileImageProps {
  userProfile: UserProfile;
}

function UploadUserProfileImage({ userProfile }: UploadUserProfileImageProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      await uploadFile(file);
      // let the user know it was successful
      setShowSuccessMessage(true);
    }
    if (userProfile && userProfile.imageUrl) {
      // Use userProfile.imageUrl
    }
  };

  const uploadFile = async (file: File) => {
    // Create a storage reference
    const storageRef = ref(storage, `${userProfile.UID}/profileImages/${file.name}`);

    // Upload the file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save the download URL to the userProfile state
    await userService.updateProfileImageUrl(userProfile.UID, downloadURL);

    dispatch(updateUserProfileImage(downloadURL));
  };

  return (
    <FormGroup>
      <PopupMessage message="Profile image successfully uploaded!"
        open={showSuccessMessage}
        setIsOpen={setShowSuccessMessage} />
      <FormLabel>Choose a user Profile Image</FormLabel>
      <button className="profile-image" onClick={() => {
        if (fileInputRef.current !== null && fileInputRef.current !== undefined) {
          fileInputRef.current.click()
        }
      }}>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
        {userProfile && userProfile.imageUrl
          ? <img src={userProfile.imageUrl} alt="User profile" style={{ width: '10%', borderRadius: '50px' }} />
          :
          <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>{emptyProfileImage} Upload Image</div>
          </>
        }
      </button>
    </FormGroup>
  );
}

export default UploadUserProfileImage;