import React from "react";
import { render, screen } from "@testing-library/react";
import ContentContainer from "./ContentContainer";

describe("MentorPortal Content Container", () => {

    it("renders the title when provided", () => {
        render(
            <ContentContainer title="Test Title">
                {}
            </ContentContainer>,
        );
        expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("renders the subtitle when provided", () => {
        render(
            <ContentContainer subtitle="Test subtitle">
                {}
            </ContentContainer>,
        );
        expect(screen.getByText("Test subtitle")).toBeInTheDocument();
    });

    it("renders the content", () => {
        render(
            <ContentContainer>
                <p>Test content</p>
            </ContentContainer>,
        );
        expect(screen.getByText("Test content")).toBeInTheDocument();
    });
});