import React, { useState } from 'react'
import { Text, Input, Box, Grid, VStack, HStack } from "@chakra-ui/react"
import { Button } from "@/components/ui/button"
import axios from 'axios'
import DatePicker from '../../components/DatePicker/DatePicker'

export const AdminReservation = () => {
  const [currentAction, setCurrentAction] = useState('read');
  
  // CREATE / UPDATE
  const [userId, setUserId] = useState('');
  const [hotelId, setHotelId] = useState('');
  const [checkInDate,setCheckInDate] = useState('');
  const [checkOutDate,setCheckOutDate] = useState('');
  const [roomNumbers, setRoomNumbers] = useState([]);

  // READ

  const [userReservations, setUserReservations] = useState([]);
  const [userCurrentReservations, setUserCurrentReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // meseci su od 0
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleAddReservation = async () => {
    try {
        const roomNumbersList = roomNumbers.replace(/\s+/g, '').split(',');
        const requestBody = roomNumbersList.map(Number); 
        const formattedCheckInDate = new Date(checkInDate).toISOString();
        const formattedCheckOutDate = new Date(checkOutDate).toISOString();
        const response = await axios.post(
            `http://localhost:5193/Reservation/AddReservation/${userId}/${hotelId}?checkInDate=${formattedCheckInDate}&checkOutDate=${formattedCheckOutDate}`,
            requestBody, 
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
        );

      console.log('Response:', response.data);
      if (response.status === 200) {
        alert(`Uspešno kreiranje rezervacije.`);
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  const handleGetUserReservations = async () => {
    try {
      const response = await axios.get(`http://localhost:5193/Reservation/GetUserReservations/${userId}`); 
      setUserReservations(response.data);
      setCurrentAction('readReservations'); 
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const handleGetUserCurrentReservations = async () => {
    try {
      const response = await axios.get(`http://localhost:5193/Reservation/GetUserCurrentReservations/${userId}`); 
      setUserCurrentReservations(response.data);
      setCurrentAction('readCurrentReservations'); 
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const handleGetAllReservations = async () => {
    try {
      const response = await axios.get(`http://localhost:5193/Reservation/GetAllReservations`); 
      setAllReservations(response.data); 
      setCurrentAction('readAllReservations'); 
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const renderContent = () => {
      switch (currentAction) {
        case 'create':
          return (
            <>
            <HStack width="100%" spacing={4}>
                <Text width="200px">User ID :</Text>
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Hotel ID :</Text>
                <Input
                  value={hotelId}
                  onChange={(e) => setHotelId(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Broj soba :</Text>
                <Input
                  value={roomNumbers}
                  onChange={(e) => setRoomNumbers(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <DatePicker 
                checkInDate={checkInDate}
                setCheckInDate={setCheckInDate}
                checkOutDate={checkOutDate}
                setCheckOutDate={setCheckOutDate} 
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Button
                  padding={3}
                  backgroundColor='#007bff'
                  width='200px'
                  variant="solid"
                  _hover={{
                    bg: "#0056b3",
                    color: "white",
                    boxShadow: "md",
                    transition: "background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onClick={handleAddReservation} 
                >
                  Kreiraj
                </Button>
              </HStack>
            </>
          );
        case 'readReservations':
          return(
          <>
            <HStack width="100%" spacing={4}>
              <Text width="200px">User ID :</Text>
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                width="25%"
                color='white'
                p={3}
                bg='#2a2629'
              />
            </HStack>
            <HStack width="100%" spacing={4}>
              <Button
                padding={3}
                backgroundColor='#007bff'
                width='200px'
                variant="solid"
                _hover={{
                  bg: "#0056b3",
                  color: "white",
                  boxShadow: "md",
                  transition: "background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={handleGetUserReservations} 
              >
                Vrati
              </Button>
            </HStack>

            {userReservations && (
              <VStack mt={10} display='flex' alignItems='flex-start'>
                {userReservations.map((reservation, index) => (
                <React.Fragment key={index}>
                    <Box display='flex' justifyContent='center' style={{'fontSize': '20px', fontWeight: 'bold', marginTop: '20px'}}>
                    <Text>{`Datum prijave: ${formatDate(reservation.checkInDate)} | Datum odjave: ${formatDate(reservation.checkOutDate)} | Cena: ${reservation.totalPrice} EUR`}</Text>
                    </Box>
                    {reservation.rooms.map((room) => (
                    <VStack key={index} alignItems="flex-start" p={2} bg="#2a2629" w='100%' borderRadius="md">
                    <Text fontSize="md" color="white">Broj sobe: {room.roomNumber}</Text>
                    <Text fontSize="md" color="white">Tip sobe: {room.typeOfRoom}</Text>
                    <Text fontSize="md" color="white">Cena za noć: {room.priceForNight} EUR</Text>
                    <Text fontSize="md" color="white">Opis sobe: {room.description}</Text>
                    <Text fontSize="md" color="white">Kapacitet: {room.numberOfPersons} osoba</Text>
                  </VStack>
                    ))}
                </React.Fragment>
            ))}
              </VStack>
            )}
          </>
          );
        case 'readCurrentReservations':
            return(
            <>
              <HStack width="100%" spacing={4}>
                <Text width="200px">User ID :</Text>
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Button
                  padding={3}
                  backgroundColor='#007bff'
                  width='200px'
                  variant="solid"
                  _hover={{
                    bg: "#0056b3",
                    color: "white",
                    boxShadow: "md",
                    transition: "background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onClick={handleGetUserCurrentReservations} 
                >
                  Vrati
                </Button>
              </HStack>
  
              {userCurrentReservations && (
                <VStack mt={10} display='flex' alignItems='flex-start'>
                  {userCurrentReservations.map((reservation, index) => (
                  <React.Fragment key={index}>
                      <Box display='flex' justifyContent='center' style={{'fontSize': '20px', fontWeight: 'bold', marginTop: '20px'}}>
                      <Text>{`Datum prijave: ${formatDate(reservation.checkInDate)} | Datum odjave: ${formatDate(reservation.checkOutDate)} | Cena: ${reservation.totalPrice} EUR`}</Text>
                      </Box>
                      {reservation.rooms.map((room) => (
                      <VStack key={index} alignItems="flex-start" p={2} bg="#2a2629" w='100%' borderRadius="md">
                      <Text fontSize="md" color="white">Broj sobe: {room.roomNumber}</Text>
                      <Text fontSize="md" color="white">Tip sobe: {room.typeOfRoom}</Text>
                      <Text fontSize="md" color="white">Cena za noć: {room.priceForNight} EUR</Text>
                      <Text fontSize="md" color="white">Opis sobe: {room.description}</Text>
                      <Text fontSize="md" color="white">Kapacitet: {room.numberOfPersons} osoba</Text>
                    </VStack>
                      ))}
                  </React.Fragment>
              ))}
                </VStack>
              )}
            </>
            );
        case 'readAllReservations':
          return(
          <>
            {allReservations && (
                <VStack mt={10} display='flex' alignItems='flex-start'>
                  {allReservations.map((reservation, index) => (
                  <React.Fragment key={index}>
                      <Box display='flex' justifyContent='center' style={{'fontSize': '20px', fontWeight: 'bold', marginTop: '20px'}}>
                      <Text>{`Datum prijave: ${formatDate(reservation.checkInDate)} | Datum odjave: ${formatDate(reservation.checkOutDate)} | Cena: ${reservation.totalPrice} EUR`}</Text>
                      </Box>
                      {reservation.rooms.map((room) => (
                      <VStack key={index} alignItems="flex-start" p={2} bg="#2a2629" w='100%' borderRadius="md">
                      <Text fontSize="md" color="white">Broj sobe: {room.roomNumber}</Text>
                      <Text fontSize="md" color="white">Tip sobe: {room.typeOfRoom}</Text>
                      <Text fontSize="md" color="white">Cena za noć: {room.priceForNight} EUR</Text>
                      <Text fontSize="md" color="white">Opis sobe: {room.description}</Text>
                      <Text fontSize="md" color="white">Kapacitet: {room.numberOfPersons} osoba</Text>
                    </VStack>
                      ))}
                  </React.Fragment>
              ))}
                </VStack>
            )}
          </>
          );
        default:
          return <></>;
      }
    };
    
  return (
    <div className='sekcije'>
    <Box padding={20}>
      <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={4}>
        <Button
          padding={3}
          colorPalette="green"
          variant="solid"
          _hover={{
            bg: 'dark-green',
            color: 'white',
            boxShadow: 'md',
            transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
          }}
          onClick={() => setCurrentAction('create')}
        >
          Kreiraj rezevaciju
        </Button>
        <Button 
          padding={3}
          colorPalette="blue"
          variant="solid"
          _hover={{
            bg: 'dark-blue',
            color: 'white',
            boxShadow: 'md',
            transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
          }}
          onClick={() => setCurrentAction('readReservations')}
        >
          Vrati korisnikove rezervacije
        </Button>
        <Button 
          padding={3}
          colorPalette="blue"
          variant="solid"
          _hover={{
            bg: 'dark-blue',
            color: 'white',
            boxShadow: 'md',
            transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
          }}
          onClick={() => setCurrentAction('readCurrentReservations')}
        >
          Vrati trenutne rezervacije
        </Button>
        <Button 
          padding={3}
          colorPalette="blue"
          variant="solid"
          _hover={{
            bg: 'dark-blue',
            color: 'white',
            boxShadow: 'md',
            transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
          }}
          onClick={handleGetAllReservations}
        >
          Vrati sve rezervacije
        </Button>
      </Grid>
      <VStack mt={20} align="flex-start" spacing={4} gap={4}>
        {renderContent()}
      </VStack>
    </Box>
    </div>
  )
}
