import React, { useState, useRef, LegacyRef } from 'react';
import userService from '../../../service/userService';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserProfile } from '../../../types/userProfile';
import { useAppDispatch } from '../../../redux/hooks'
import { updateProfile, updateProfileImageUrl } from '../../../redux/reducers/profileReducer';
import { Button, FormGroup, FormLabel } from '@mui/material';
import "./UploadUserProfileImage.css"
import { emptyProfileImage } from '../../../icons/icons';

interface UploadUserProfileImageProps {
  userProfile: UserProfile;
}

function UploadUserProfileImage({ userProfile }: UploadUserProfileImageProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const fileRef = ref(storage, `profilePictures/${userProfile.UID}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    dispatch(updateProfileImageUrl(downloadURL));
  };

  return (
    <FormGroup>
      <FormLabel>Chose a user Profile Image</FormLabel>
      <button className="profile-image" onClick={() => {
        if (fileInputRef.current !== null && fileInputRef.current !== undefined) {
          fileInputRef.current.click()
        }
      }}>
        {emptyProfileImage}
      </button>
      <input onChange={handleFileChange} multiple={false} ref={fileInputRef} type='file' hidden />
    </FormGroup>
  );
}

export default UploadUserProfileImage;