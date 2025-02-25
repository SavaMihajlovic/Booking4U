import { Box, HStack, Text } from '@chakra-ui/react';
import React from 'react'

const DatePicker = ({checkInDate,setCheckInDate,checkOutDate,setCheckOutDate}) => {

    const handleCheckInDateChange = (event) => {
        const date = event.target.value;
        setCheckInDate(date);
    };
    
    const handleCheckOutDateChange = (event) => {
        const date = event.target.value;
        setCheckOutDate(date);
    };

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getNextDayDate = (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        const year = nextDate.getFullYear();
        const month = (nextDate.getMonth() + 1).toString().padStart(2, '0');
        const day = nextDate.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <HStack
        spacing={6}
        mb={10}
        gap={10}
        flex="1"
        width="100%"
      >
        <Box flex="1" minWidth="200px" maxWidth="300px">
          <Text fontSize="lg" fontWeight="bold" color="white">Datum prijave</Text>
          <input 
            type='date' 
            name='checkInDate' 
            value={checkInDate} 
            min={getTodayDate()}
            onChange={handleCheckInDateChange} 
            style={{ 
              fontSize: '16px', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '5px', 
              color: 'black', 
              width: '100%' 
            }} 
          />
        </Box>
      
        <Box flex="1" minWidth="200px" maxWidth="300px">
          <Text fontSize="lg" fontWeight="bold" color="white">Datum odjave</Text>
          <input 
            type='date' 
            name='checkOutDate' 
            value={checkOutDate} 
            min={checkInDate ? getNextDayDate(checkInDate) : getTodayDate()}
            disabled={!checkInDate}
            onChange={handleCheckOutDateChange} 
            style={{ 
              fontSize: '16px', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '5px', 
              color: 'black', 
              width: '100%'
            }} 
          />
        </Box>
      </HStack>      
    )
}

export default DatePicker