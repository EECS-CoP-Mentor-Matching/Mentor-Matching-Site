import React, { useEffect, useState } from "react";
import surveyService from "../../../../service/surveyService";
import { SurveySchema } from "../../../../types/survey";
import { DocItem } from "../../../../types/types";
import ContentContainer from "../../../common/ContentContainer";
import { Link } from "react-router-dom";
import ModalWrapper from "../../../common/forms/modals/ModalWrapper";
import { Box, Chip, IconButton, Paper, Typography, Grid } from '@mui/material';
import CreateQuestionForm from "../../../survey/CreateQuestionForm";



function Settings() {
    return (
        <ContentContainer
          title="Manage Surveys"
          subtitle="This page allows admins to view surveys"
        >
          <CreateQuestionForm />


        </ContentContainer>
      );
}
export default Settings;