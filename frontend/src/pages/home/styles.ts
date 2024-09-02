import { styled } from '@mui/material/styles';

export const Container = styled('div')(({ theme }) => ({

  display: "flex",
  maxHeight: "100vh",
  height: "100vh",
  overflow: "hidden",
  flexDirection: "row",
  padding: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    flexDirection: "column"
  },
}));
