//  Displays the user profile:

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function ProfileView() {
    const profile = useSelector((state) => state.profile.userProfile);

    useEffect(() => {
        // Fetch profile data if needed
    }, []);

    if (!profile) return <div>Loading...</div>;

    return (
        <div>
            <h1>{profile.displayName}</h1>
            {/* Display other profile details */}
        </div>
    );
}

export default ProfileView;
