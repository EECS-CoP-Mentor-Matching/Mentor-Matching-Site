import { createTheme } from "@mui/material";

const theme = createTheme({
  components: {
    MuiButton: {
      variants: [{
        props: { variant: 'text' },
        style: {
          color: "white",
          backgroundColor: "black",
          padding: "5px",
          borderRadius: "5px",
          svg: {
            stroke: "white"
          },
          path: {
            stroke: "white"
          },
          borderBottom: "solid black 2px",
          borderRight: "solid black 2px",

          "&:hover": {
            color: "#DC4405",
            backgroundColor: "white",
            svg: {
              stroke: "#DC4405"
            },
            path: {
              stroke: "#DC4405"
            },
            borderBottom: "solid #DC4405 2px",
            borderRight: "solid #DC4405 2px",
          }
        }
      }]
    },
    MuiFormGroup: {
      variants: [{
        props: {},
        style: {
          display: 'flex',
          gap: '15px'
        }
      }]
    }
  }
});

export default theme;