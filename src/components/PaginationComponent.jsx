import React from "react";
import { Stack, Pagination } from "@mui/material";

const PaginationComponent = ({ totalPages, page, onPageChange }) => {
  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(event, value) => onPageChange(value)}
        color="primary"
        showFirstButton
        showLastButton
        size="large"
      />
    </Stack>
  );
};

export default PaginationComponent;
