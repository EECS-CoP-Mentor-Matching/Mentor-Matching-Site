import React from "react";
import { render, screen } from "@testing-library/react";
import {ActiveProfiles} from "../ActiveProfiles";

describe('Active Profiles', () => {
    test('renders Active Profiles title', () => {
        render(<ActiveProfiles />);
        expect(screen.getByText('Active Profiles')).toBeInTheDocument();
    });

    test('renders subtitle', () => {
        render(<ActiveProfiles />);
        expect(screen.getByText('A collection of the profiles that you\'ve created')).toBeInTheDocument();
    });
});
