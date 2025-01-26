import React from "react";
import { Stack, Pagination, Typography, Box } from "@mui/material";

const PaginationComponent = ({ totalPages, page, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <Box 
      sx={{ 
        mt: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Page {page} sur {totalPages}
      </Typography>
      <Stack 
        spacing={2} 
        alignItems="center"
        sx={{
          '& .MuiPagination-ul': {
            gap: { xs: 0.5, sm: 1 },
          },
          '& .MuiPaginationItem-root': {
            fontSize: { xs: '0.875rem', sm: '1rem' },
            minWidth: { xs: '32px', sm: '40px' },
            height: { xs: '32px', sm: '40px' },
            borderRadius: '8px',
            '&.Mui-selected': {
              fontWeight: 'bold',
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          },
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => onPageChange(value)}
          color="primary"
          showFirstButton
          showLastButton
          size="large"
          siblingCount={1}
          boundaryCount={1}
        />
      </Stack>
    </Box>
  );
};

export default PaginationComponent;