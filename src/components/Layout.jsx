import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Container, Box } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container component="main" sx={{ flexGrow: 1, my: 4 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;
