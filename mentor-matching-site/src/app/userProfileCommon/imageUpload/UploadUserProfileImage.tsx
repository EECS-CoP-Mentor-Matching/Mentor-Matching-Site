import React, { useState, useRef, LegacyRef } from 'react';
import userService from '../../../service/userService';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserProfile as UserProfileType } from '../../../types/userProfile';
import { useAppDispatch } from '../../../redux/hooks'
import { updateProfile, updateProfileImageUrl } from '../../../redux/reducers/profileReducer';
import { Button, FormGroup, FormLabel } from '@mui/material';
import "./UploadUserProfileImage.css"
// import { emptyProfile/ Remove the unused import statementImage } from '../../../icons/icons';

interface UploadUserProfileImageProps {
  userProfile: UserProfile;
}

interface UserProfile {
  imageUrl?: string; // Add the imageUrl property
}

function UploadUserProfileImage({ userProfile }: UploadUserProfileImageProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      await uploadFile(file);
    }
    if (userProfile && userProfile.imageUrl) {
      // Use userProfile.imageUrl
    }
  };

  const uploadFile = async (file: File) => {
    // Create a storage reference
    const storageRef = ref(storage, `profileImages/${file.name}`);

    // Upload the file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save the download URL to the userProfile state
    dispatch(updateProfileImageUrl(downloadURL));
  };

  return (
    <FormGroup>
      <FormLabel>Choose a user Profile Image</FormLabel>
      <button className="profile-image" onClick={() => {
        if (fileInputRef.current !== null && fileInputRef.current !== undefined) {
          fileInputRef.current.click()
        }
      }}>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
        {userProfile && userProfile.imageUrl
            ? <img src={userProfile.imageUrl} alt="User profile" />
            : <span>Upload Image</span> // or use an icon/button for upload
        }
      </button>
    </FormGroup>
  );
}

export default UploadUserProfileImage;