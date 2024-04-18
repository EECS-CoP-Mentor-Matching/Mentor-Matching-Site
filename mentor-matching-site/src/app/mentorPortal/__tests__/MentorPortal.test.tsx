import React from "react";
import { render, screen } from "@testing-library/react";
import MentorPortal from "../MentorPortal";
import ContentContainer from "../../common/ContentContainer";

describe('MentorPortal', () => {
    it('renders with TopNavigationBar', () => {
        render(<MentorPortal />);
        expect(screen.getByText('Create Profile')).toBeInTheDocument();
    });
    test('renders default Create Profile page', () => {
        render(<MentorPortal />);
        expect(screen.getByText('Mentor Profile')).toBeInTheDocument();
    });
});
