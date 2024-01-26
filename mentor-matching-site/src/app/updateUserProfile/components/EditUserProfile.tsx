import React, { useState } from 'react';
import userService from '../../../service/userService';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserProfile } from '../../../types/userProfile';
import { useAppDispatch } from '../../../redux/hooks'
import { updateProfile } from '../../../redux/reducers/profileReducer';
import { Button, FormGroup } from '@mui/material';
import FormGroupCols from '../../common/forms/FormGroupCols';
import FormGroupRows from '../../common/forms/FormGroupRows';

interface EditUserProfileProps {
    userProfile: UserProfile;
    saveChanges: () => void
}

function EditUserProfile({ userProfile, saveChanges }: EditUserProfileProps) {
    const dispatch = useAppDispatch();
    const [displayName, setDisplayName] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setProfilePicture(event.target.files[0]);
        }
    };

    const uploadFile = async (file: File): Promise<string> => {
        setIsUploading(true);
        setUploadError(null);
        try {
            const fileRef = ref(storage, `profilePictures/${userProfile.UID}`);
            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setIsUploading(false);
            return downloadURL;
        } catch (error) {
            console.error('File upload error:', error);
            setUploadError('Failed to upload file. Please try again.');
            setIsUploading(false);
            throw error; // Re-throw the error so that it can be handled in handleSubmit.
        }
    };

    const handleSubmit = async () => {
        try {
            let profilePictureUrl = userProfile?.profilePictureUrl || '';
            if (profilePicture) {
                profilePictureUrl = await uploadFile(profilePicture);
            }
            const updatedProfileData = {
                ...userProfile,
                contact: {
                    ...userProfile?.contact,
                    displayName
                },
                profilePictureUrl, // Include the URL of the uploaded image
                // Include other updated preferences here
            } as UserProfile;

            await userService.updateUserProfile(updatedProfileData.UID, updatedProfileData);
            dispatch(updateProfile(updatedProfileData));
            alert('Profile updated successfully');
            saveChanges();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <FormGroup>
            <FormGroupCols>
                <FormGroupRows>
                    <input
                        type="text"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder="Display Name"
                    />
                    <input type="file" onChange={handleFileChange} />
                    {/* Add inputs for other editable fields of the user profile */}
                    {isUploading && <div>Loading...</div>}
                    {uploadError && <div className="error-message">{uploadError}</div>}
                </FormGroupRows>
                <FormGroupRows>
                    <Button onClick={handleSubmit} disabled={isUploading}>Save Changes</Button>
                </FormGroupRows>
            </FormGroupCols>
        </FormGroup>
    );
}

export default EditUserProfile;