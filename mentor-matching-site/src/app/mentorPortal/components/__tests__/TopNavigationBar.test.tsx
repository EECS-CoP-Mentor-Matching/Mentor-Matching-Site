import React from 'react';
import { render, screen } from '@testing-library/react';
import PortalNavigationBar from '../../../common/navigation/PortalNavigationBar';

describe('Top Navigation Bar', () => {
    const navItems = ['Test1', 'Test2'];

    it('renders navigation items', () => {
        render(<PortalNavigationBar navItems={navItems} />);
        navItems.forEach(item => {
            expect(screen.getByText(item)).toBeInTheDocument();
        });
    });
});
