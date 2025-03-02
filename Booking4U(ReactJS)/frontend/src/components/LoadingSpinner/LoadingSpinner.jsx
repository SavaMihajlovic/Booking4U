import { Box } from '@chakra-ui/react';
import React from 'react';

const LoadingSpinner = () => {
  return (
    <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        background="rgba(0, 0, 0, 0.5)"
        backdropBlur="10px"
        zIndex="overlay"
        onClick={() => setLoginDialogOpen(false)}
    >
        <div className="spinner"></div>
    </Box>
    
  );
}

export default LoadingSpinner;