import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdCheckCircle } from 'react-icons/md';
import { Box, Text, Button, VStack } from '@chakra-ui/react';
import { s } from 'framer-motion/client';

export const PaymentSuccess = () => {
  const location = useLocation();
  const hasRun = useRef(false);  
  const navigate = useNavigate();

  useEffect(() => {
    if (hasRun.current) return;  

    const confirmOrderAndAddMoney = async () => {
      const url = location.search;
      const params = new URLSearchParams(url.split('?')[1]);
      const user = params.get('user');
      const hotel = params.get('hotel');
      const roomNumbers = params.getAll('roomNumbers').map(Number);
      const checkInDate = params.get('checkInDate');
      const checkOutDate = params.get('checkOutDate');
      const token = params.get('token');

      const formattedCheckInDate = new Date(checkInDate).toISOString();
      const formattedCheckOutDate = new Date(checkOutDate).toISOString();

      console.log(url);

      if (!token || !user) {
        navigate('/');  
        return;
      }

      try {
        const responseConfirmPayment = await axios.post(`http://localhost:5193/Paypal/ConfirmOrder/${token}`);
        if(responseConfirmPayment.status === 200) {

            const responseAddReservation = await axios.post(
                `http://localhost:5193/Reservation/AddReservation/${user}/${hotel}?checkInDate=${formattedCheckInDate}&checkOutDate=${formattedCheckOutDate}`,
                roomNumbers, 
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
            );

            if(responseAddReservation.status === 200) {
                alert('Uspešno ste rezervisali sobu!');
                navigate('/payment-success');
            } else {
                alert('Greška prilikom rezervacije sobe!');
                navigate('/payment-failure');   
            }
        } else {
            console.error('Nije moguće potvrditi plaćanje.');
        }
        
      } catch(error) {
        alert('Greška pri plaćanju:', error);
        navigate('/payment-failure'); 
      }
    }

    confirmOrderAndAddMoney();
    hasRun.current = true;
  }, [location]);

  const handleRedirect = () => {
    navigate('/');  
  };

  return (
    <>
        <section>
            <Box textAlign="center" p={8}>
                <VStack spacing={4}>
                    <Box color="green.500">
                    <MdCheckCircle size={80} />
                    </Box>
                    <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    Uspešno plaćanje
                    </Text>
                    <Text fontSize="lg" marginBottom={5}>
                    Vaša uplata je uspešno procesuirana. Hvala na kupovini!
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
                        }}onClick={handleRedirect}>
                            Povratak na početnu stranicu 
                    </Button>
                </VStack>
            </Box>
        </section>
    </>
  );
};
