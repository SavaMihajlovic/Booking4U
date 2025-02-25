import { Box, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RoomInfo from '../../components/RoomInfo/RoomInfo';
import DatePicker from '../../components/DatePicker/DatePicker';
import { UserFetch } from '../../components/UserFetch/UserFetch';

export const UserReservation = () => {

  const [checkInDate,setCheckInDate] = useState('');
  const [checkOutDate,setCheckOutDate] = useState('');
  const [roomsForReservation, setRoomsForReservation] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const hotel = location.state?.hotel;

  useEffect(() => {
    if (!checkInDate || !checkOutDate || roomsForReservation.length === 0) {
      setTotalAmount(0);
      return;
    }
    const fetchTotalPrice = async () => {
      try {
        const requestBody = roomsForReservation.map(Number); 
        const formattedCheckInDate = new Date(checkInDate).toISOString();
        const formattedCheckOutDate = new Date(checkOutDate).toISOString();

        const response = await axios.post(
          `http://localhost:5193/Reservation/GetTotalPrice/${hotel.id}?checkInDate=${formattedCheckInDate}&checkOutDate=${formattedCheckOutDate}`,
          requestBody, 
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setTotalAmount(response.data);
      } catch (error) {
        console.error('Error fetching total price:', error);
      }
    };

    fetchTotalPrice();
  }, [checkOutDate, roomsForReservation]);

  const handlePayment = async () => {
    try {
        const userData = await UserFetch();
        if(userData) {
          setUser(userData);
        } else {
          return;
        }

        const requestBody = roomsForReservation.map(Number); 
        const formattedCheckInDate = new Date(checkInDate).toISOString();
        const formattedCheckOutDate = new Date(checkOutDate).toISOString();

        const response = await axios.post(
          `http://localhost:5193/Reservation/AddReservation/${user.UserId}/${hotel.id}?checkInDate=${formattedCheckInDate}&checkOutDate=${formattedCheckOutDate}`,
          requestBody, 
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if(response.status === 200) {
          alert('Uspešno kreiranje rezervacije.');
          navigate('/user-my-reservations')
        }
    } catch(error) {
      console.error('Error adding reservation.', error);
    }
  }

  return (
    <>
    <div className='sekcije'>
    <Box display='flex' justifyContent='center' style={{'fontSize': '25px' , fontWeight: 'bold', marginTop: '20px'}}>
        <Text>Hotel {hotel.name}</Text>
    </Box>
        <section id="hotels">
            <DatePicker 
              checkInDate={checkInDate}
              setCheckInDate={setCheckInDate}
              checkOutDate={checkOutDate}
              setCheckOutDate={setCheckOutDate} 
            />
            <div className="items-container">
            <div className="reservation-container">
                    {hotel.rooms.map((room, index) => (
                        <RoomInfo 
                          room={room} 
                          key={index} 
                          checkInDate={checkInDate}
                          checkOutDate={checkOutDate}
                          roomsForReservation={roomsForReservation}
                          setRoomsForReservation={setRoomsForReservation}/>
                    ))}
            </div>
            </div>
        </section>
    </div>

    {totalAmount > 0 && (
         <div className="payment-footer" onClick={handlePayment}>
         <Text fontSize="md">
           Idi na plaćanje <span style={{fontWeight: 'bolder'}}>{totalAmount} EUR</span>
         </Text>
       </div>
    )}
    </>
  )
}
