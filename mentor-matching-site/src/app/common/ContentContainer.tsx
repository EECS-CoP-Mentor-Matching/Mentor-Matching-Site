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
        <Box sx={{ marginTop: '35px', ...sx }}>
            {title && <Typography variant="h4">{title}</Typography>}
            {subtitle && <Typography variant="h6">{subtitle}</Typography>}
            {children}
        </Box>);
}

export default ContentContainer;
