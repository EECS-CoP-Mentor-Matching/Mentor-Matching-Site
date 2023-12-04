import React from "react";
import { render, screen } from "@testing-library/react";
import {CreateProfile} from "./CreateProfile";

describe('Create Profile', () => {
    test('renders Mentor Portal title', () => {
        render(<CreateProfile />);
        expect(screen.getByText('Mentor Profile')).toBeInTheDocument();
    });

    test('renders subtitle', () => {
        render(<CreateProfile />);
        expect(screen.getByText('Add your preferences to match with mentees')).toBeInTheDocument();
    });
});
