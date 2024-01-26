import React, { useState } from 'react';
import userService from '../../../service/userService';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserProfile } from '../../../types/userProfile';
import { useAppDispatch } from '../../../redux/hooks'
import { updateProfile, updateProfileImageUrl } from '../../../redux/reducers/profileReducer';
import { Button, FormGroup } from '@mui/material';
import FormGroupCols from '../../common/forms/FormGroupCols';
import FormGroupRows from '../../common/forms/FormGroupRows';

interface UploadUserProfileImageProps {
    userProfile: UserProfile;
}

function UploadUserProfileImage({ userProfile }: UploadUserProfileImageProps) {
    const dispatch = useAppDispatch();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            await uploadFile(file);
        }
    };

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        setUploadError(null);
        try {
            const fileRef = ref(storage, `profilePictures/${userProfile.UID}`);
            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setIsUploading(false);
            dispatch(updateProfileImageUrl(downloadURL));
        } catch (error) {
            console.error('File upload error:', error);
            setUploadError('Failed to upload file. Please try again.');
            setIsUploading(false);
            throw error; // Re-throw the error so that it can be handled in handleSubmit.
        }
    };

    return (
        <FormGroup>
            <FormGroupCols>
                <FormGroupRows>
                    <div>
                        Chose a user Profile Image <input type="file" onChange={handleFileChange} />
                    </div>
                    {/* Add inputs for other editable fields of the user profile */}
                    {isUploading && <div>Loading...</div>}
                    {uploadError && <div className="error-message">{uploadError}</div>}
                </FormGroupRows>
            </FormGroupCols>
        </FormGroup>
    );
}

export default UploadUserProfileImage;