import React from "react";
import { render, screen } from "@testing-library/react";
import CreateMentorProfile from "../CreateMentorProfile";

describe('Create Profile', () => {
    test('renders Mentor Portal title', () => {
        render(<CreateMentorProfile />);
        expect(screen.getByText('Mentor Profile')).toBeInTheDocument();
    });

    test('renders subtitle', () => {
        render(<CreateMentorProfile />);
        expect(screen.getByText('Add your preferences to match with mentees')).toBeInTheDocument();
    });
});
