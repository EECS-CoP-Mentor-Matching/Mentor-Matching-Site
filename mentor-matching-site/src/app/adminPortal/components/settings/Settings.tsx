import React, { useEffect, useState } from "react";
import surveyService from "../../../../service/surveyService";
import { SurveySchema } from "../../../../types/survey";
import ContentContainer from "../../../common/ContentContainer";
import { Link } from "react-router-dom";
import ModalWrapper from "../../../common/forms/modals/ModalWrapper";
import { Box, Chip, IconButton, Paper, Typography, Grid } from '@mui/material';



function Settings() {
  const [schema, setSchemas] = useState<SurveySchema[]>([]);

  const fetchSchemas = async() => {
    try {
      const result = await surveyService.getSurveySchemas();
      setSchemas(result.length ? result : [])
    } catch (error) {
      console.error("Error fetching survey schemas:", error)
      setSchemas([]);
    }
  };

  useEffect(() => {
      fetchSchemas();
  }, []);


    return (
        <ContentContainer
          title="Manage Surveys"
          subtitle="This page allows admins to view surveys"
        >
        <Box>
          <Grid>
            {schema.map((survey) => (
              <div>
                <h3>{survey.title}</h3>
                <p> Version: {survey.version}</p>
                <p> Is Current Schema? {String(survey.isCurrentSchema)}</p>

              </div>
            ))}
          </Grid>
        </Box>


        </ContentContainer>
      );
}
export default Settings;