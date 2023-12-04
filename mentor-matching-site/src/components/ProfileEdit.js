// Allows users to edit their profile:


import React, { useState } from 'react';
import { userService } from '../services/UserService';
import { storage } from '../path/to/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function ProfileEdit({ userId }) {
    const [displayName, setDisplayName] = useState('');
    const [profilePicture, setProfilePicture] = useState(null); // Holds the selected file

    const handleFileChange = (event) => {
        setProfilePicture(event.target.files[0]);
    };

    const uploadFile = async (file) => {
        const fileRef = ref(storage, 'profilePictures/' + userId); // File path in storage
        const snapshot = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let profilePictureUrl = '';
            if (profilePicture) {
                profilePictureUrl = await uploadFile(profilePicture);
            }
            const updatedProfileData = {
                displayName,
                profilePictureUrl, // Include the URL of the uploaded image
                // Include other updated preferences here
            };
            await userService.updateUserProfile(userId, updatedProfileData);
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
            {/* Add inputs for other preferences */}
            <button type="submit">Save Changes</button>
        </form>
    );
}

export default ProfileEdit;