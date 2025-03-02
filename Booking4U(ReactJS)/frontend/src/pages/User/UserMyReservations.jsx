import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RoomInfo from '../../components/RoomInfo/RoomInfo';
import { UserFetch } from '../../components/UserFetch/UserFetch';
import ReservedRoomInfo from '../../components/ReservedRoomInfo/ReservedRoomInfo';
import { Box, Text } from '@chakra-ui/react';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

export const UserMyReservations = () => {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await UserFetch();
        if (!userData) {
          setLoading(false);
          return;
        } 
        setUser(userData);

        const response = await axios.get(`http://localhost:5193/Reservation/GetUserReservations/${userData.UserId}`);
        setReservations(response.data);
      } catch (error) {
        console.error('Greška pri učitavanju podataka:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner/>;
  }

  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className='sekcije'>
      <section id="hotels">
        <div className="items-container">
          <div className="reservation-container">
            {reservations.map((reservation, index) => (
              <React.Fragment key={index}>
                <Box display='flex' justifyContent='center' style={{'fontSize': '25px', fontWeight: 'bold', marginTop: '20px'}}>
                  <Text>{`Datum prijave: ${formatDate(reservation.checkInDate)} - Datum odjave: ${formatDate(reservation.checkOutDate)} | Cena: ${reservation.totalPrice} EUR`}</Text>
                </Box>
                {reservation.rooms.map((room, roomIndex) => (
                  <ReservedRoomInfo
                    key={roomIndex}
                    room={room}
                    checkInDate={reservation.checkInDate}
                    checkOutDate={reservation.checkOutDate}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
