import React, { useState } from 'react';
import axios from 'axios';

const DocuSignButton = () => {
    const [authUrl, setAuthUrl] = useState('');

    const getAuthUrl = async () => {
        try {
            const response = await axios.get('/MY_FIREBASE_FUNCTION_URL/getAuthorizationUrl'); // Placeholder because Im unable to run the command firebase deploy --only functions until we upgrade
            setAuthUrl(response.data);
        } catch (error) {
            console.error('Error getting auth URL', error);
        }
    };

    const handleSign = () => {
        getAuthUrl();
    };

    return (
        <div>
            <button onClick={handleSign}>Sign Document</button>
            {authUrl && <a href={authUrl}>Continue to DocuSign</a>}
        </div>
    );
};

export default DocuSignButton;
