// Allows users to edit their profile:

import React, { useState, useEffect } from 'react';
import userService from '../../../service/userService';
import { useDispatch } from 'react-redux';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserProfile } from '../../../types';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks'
import { updateProfile } from '../../../redux/reducers/profileReducer';


interface EditUserProfileProps {
    uid: string;
}

function EditUserProfile({ uid }: EditUserProfileProps) {
    const dispatch = useAppDispatch();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [displayName, setDisplayName] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profileData = await userService.getUserProfile(uid);
                setUserProfile(profileData);
                setDisplayName(profileData.contact.displayName || '');
                // Initialize additional fields here
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [uid]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setProfilePicture(event.target.files[0]);
        }
    };

    const uploadFile = async (file: File): Promise<string> => {
        setIsUploading(true);
        setUploadError(null);
        try {
            const fileRef = ref(storage, `profilePictures/${uid}`);
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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

            await userService.updateUserProfile(uid, updatedProfileData);
            dispatch(updateProfile(updatedProfileData));
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Display Name"
            />
            <input
                type="file"
                onChange={handleFileChange}
            />
            {/* Add inputs for other editable fields of the user profile */}
            {isUploading && <div>Loading...</div>}
            {uploadError && <div className="error-message">{uploadError}</div>}
            <button type="submit" disabled={isUploading}>Save Changes</button>
        </form>
    );
}

export default EditUserProfile;