import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  TextField, 
  Button 
} from "@mui/material";
import { 
  Search, 
  Clear 
} from '@mui/icons-material';

const SearchBar = ({ 
  searchTerm, 
  setSearchTerm, 
  handleSearch, 
  handleClear,
  placeholder = "Rechercher un artiste",
  className 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleSearch();
    }
  };

  return (
    <Box 
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        mb: 4,
        flexWrap: 'wrap'
      }}
      className={className}
    >
      <TextField
        fullWidth
        label={placeholder}
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        InputProps={{
          startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
          endAdornment: searchTerm && (
            <Clear
              sx={{ 
                color: 'text.secondary', 
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' }
              }}
              onClick={handleClear}
            />
          )
        }}
        sx={{ 
          minWidth: { xs: 250, sm: 300 },
          maxWidth: { xs: '100%', sm: 400 }
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        disabled={!searchTerm.trim()}
        sx={{ 
          height: '56px',
          minWidth: 120,
          transition: 'all 0.3s ease',
          '&:hover': { 
            transform: 'scale(1.05)',
            boxShadow: 3 
          }
        }}
      >
        Rechercher
      </Button>
    </Box>
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleClear: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string
};

export default SearchBar;