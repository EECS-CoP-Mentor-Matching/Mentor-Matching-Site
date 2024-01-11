import { createTheme } from "@mui/material";

const theme = createTheme({
  components: {
    MuiTabs: {
      variants: [{
        props: {},
        style: {
          color: '',
          breakpoints: {
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem',
              md: '1rem',
            },
            padding: {
              xs: 1,
              sm: 1.5,
              md: 2,
            },
          },
          textTransform: 'none',
          '.MuiTab-root:hover': {
            backgroundColor: 'transparent',
          },
          '.Mui-selected': {
            color: '#f7ebeb',
          },
          '.MuiTabs-indicator': {
            backgroundColor: '#f7ebeb',
          },
        }
      }]
    },
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
    },
    MuiTextField: {
      variants: [{
        props: {},
        style: {
          maxWidth: '200px'
        }
      }]
    }
  }
});

export default theme;