import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

type ContentContainerProps = {
    title?: string;
    subtitle?: string;
    children: ReactNode;
};

const ContentContainer = ({ title, subtitle, children }: ContentContainerProps) => {
    return (
        <Box sx={{marginTop: '35px'}}>
            {title && <Typography variant="h4">{title}</Typography>}
            {subtitle && <Typography variant="h6">{subtitle}</Typography>}
            <div>
                {children}
            </div>
        </Box>);
}

export default ContentContainer;
