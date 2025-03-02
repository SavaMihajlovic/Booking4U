import { Box, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RoomInfo from '../../components/RoomInfo/RoomInfo';
import DatePicker from '../../components/DatePicker/DatePicker';
import { UserFetch } from '../../components/UserFetch/UserFetch';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

export const UserReservation = () => {

  const [checkInDate,setCheckInDate] = useState('');
  const [checkOutDate,setCheckOutDate] = useState('');
  const [roomsForReservation, setRoomsForReservation] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const hotel = location.state?.hotel;

  useEffect(() => {
    if (!checkInDate || !checkOutDate || roomsForReservation.length === 0) {
      setTotalAmount(0);
      setLoading(false);
      return;
    }
    const fetchTotalPrice = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalPrice();
  }, [checkOutDate, roomsForReservation]);

  const handlePayment = async () => {
    try {
        const userData = await UserFetch();
        if(!userData) {
          setLoading(false);
          return;
        }

        setUser(userData);

        const requestBody = roomsForReservation.map(Number); 
        const formattedCheckInDate = new Date(checkInDate).toISOString();
        const formattedCheckOutDate = new Date(checkOutDate).toISOString();

        const validateResponse = await axios.post(
          `http://localhost:5193/Reservation/ValidateReservation/${userData.UserId}/${hotel.id}/${totalAmount}?checkInDate=${formattedCheckInDate}&checkOutDate=${formattedCheckOutDate}`,
          requestBody, 
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (validateResponse.status === 200) {
            const paymentResponse = await axios.post(
              `http://localhost:5193/Paypal/MakePayment?userId=${userData.UserId}&hotelId=${hotel.id}&checkInDate=${formattedCheckInDate}&checkOutDate=${formattedCheckOutDate}&ammount=${totalAmount}`,
              requestBody,
              {
                headers: { "Content-Type": "application/json" }
              }
            );
          
            if (paymentResponse.status === 200) {
                window.location.href = paymentResponse.data; 
            } else {
                alert("Greška pri plaćanju!");
            }
        }
    } catch(error) {
      console.error('Greška pri kreiranju rezervacije ili plaćanju.', error);
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

    {loading && (<LoadingSpinner/>)}
    </>
  )
}
