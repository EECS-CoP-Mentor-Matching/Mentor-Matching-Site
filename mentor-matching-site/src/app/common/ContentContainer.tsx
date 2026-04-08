import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

type ContentContainerProps = {
    title?: string;
    subtitle?: string;
    children: ReactNode;
    sx?: any
};

const ContentContainer = ({ title, subtitle, children, sx }: ContentContainerProps) => {
    return (
        <Box sx={{
            marginTop: '35px',
            paddingBottom: '48px',   /* breathing room at the bottom of every page */
            width: '100%',
            boxSizing: 'border-box',
            ...sx
        }}>
            {title && <Typography variant="h4" sx={{ fontSize: { xs: '1.4rem', sm: '2rem', md: '2.125rem' } }}>{title}</Typography>}
            {subtitle && <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' } }}>{subtitle}</Typography>}
            {children}
        </Box>);
}

export default ContentContainer;
