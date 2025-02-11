import { Box, Text, VStack } from '@chakra-ui/react';
import React from 'react'
import { useLocation } from 'react-router-dom';
import RoomInfo from '../../components/RoomInfo/RoomInfo';

export const UserReservation = () => {

  const location = useLocation();
  const hotel = location.state?.hotel;

  return (
    <>
    <div className='sekcije'>
    <Box display='flex' justifyContent='center' style={{'fontSize': '25px' , fontWeight: 'bold', marginTop: '20px'}}>
        <Text>Hotel {hotel.name}</Text>
    </Box>
        <section id="hotels">
            <div className="items-container">
            <div className="reservation-container">
                    {hotel.rooms.map((room, index) => (
                        <RoomInfo room={room} key={index} />
                    ))}
            </div>
            </div>
        </section>
    </div>
    </>
  )
}
