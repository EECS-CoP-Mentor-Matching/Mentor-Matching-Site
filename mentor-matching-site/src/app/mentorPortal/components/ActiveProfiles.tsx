import React, {useState} from 'react';
import ContentContainer from "./ContentContainer";
import {Box, Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
};

export function ActiveProfiles() {
    return (
        <ContentContainer
            title="Active Profiles"
            subtitle="A collection of the profiles that you've created"
        >
            <p>
                Here are your active profiles:
            </p>
        </ContentContainer>
    );
}