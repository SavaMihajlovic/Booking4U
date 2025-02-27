import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdCancel } from 'react-icons/md';  
import { Box, Text, Button, VStack } from '@chakra-ui/react';  

export const PaymentFailure = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/');  
  };

  return (
    <section>
        <Box textAlign="center" p={8}>
        <VStack spacing={4}>
            <Box color="red.500">
            <MdCancel size={80} />
            </Box>
            <Text fontSize="2xl" fontWeight="bold" color="red.500">
            Neuspešno plaćanje
            </Text>
            <Text fontSize="lg" marginBottom={5}>
            Došlo je do greške rezervacije sobe. Pokušajte ponovo.
            </Text>
            <Button 
                padding={3}
                backgroundColor='#003580'
                variant="solid"
                _hover={{
                bg: "#0056A0",
                color: "white",
                boxShadow: "md",
                transition: "background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
                }} onClick={handleRedirect}>
                    Povratak na početnu stranicu 
            </Button>
        </VStack>
        </Box>
    </section>
  );
};
