import React, { useState } from 'react'
import { Text, Input, Box, Grid, VStack, HStack } from "@chakra-ui/react"
import { Button } from "@/components/ui/button"
import axios from 'axios'

export const AdminHotel = () => {
  const [currentAction, setCurrentAction] = useState('read');
  
  // CREATE / UPDATE
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [score, setScore] = useState(1);
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [centerDistance, setCenterDistance] = useState(0);
  const [beachDistance, setBeachDistance] = useState(null);
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);

  const [hotelId, setHotelId] = useState('');
  const [page, setPage] = useState(1);

  // ROOM

  const [roomNumber, setRoomNumber] = useState(0);
  const [typeOfRoom, setTypeOfRoom] = useState('');
  const [priceForNight, setPriceForNight] = useState(0);
  const [characteristics, setCharacteristics] = useState([]);
  const [roomDescription, setRoomDescription] = useState('');
  const [numberOfPersons, setNumberOfPersons] = useState(0);
  const [fileInputs, setFileInputs] = useState([0]);
  const [roomImages, setRoomImages] = useState([]); 
  
  // READ
  const [hotel, setHotel] = useState(null);
  const [hotels, setHotels] = useState([]); 

  const handleFileChange = (event) => {
    const { value, files } = event.target;
    setImage(files ? files[0] : value);
  }

  const handleAddImage = (event) => {
    const { value, files } = event.target;
    setRoomImages([...roomImages, files ? files[0] : value]);
  };

  const addFileInput = () => {
    setFileInputs([...fileInputs, fileInputs.length]);
};

  const handleAddHotel = async () => {
    try {
      const formData = new FormData();
      
      formData.append('Name', name);
      formData.append('Country', country);
      formData.append('City', city);
      formData.append('Address', address);
      formData.append('Score', parseFloat(score));
      formData.append('Description', description);
      formData.append('Contact', contact);
      formData.append('CenterDistance', parseFloat(centerDistance));

      if (beachDistance !== null && beachDistance !== '') {
        formData.append('BeachDistance', parseFloat(beachDistance)); // Ako je uneseno, pošaljemo vrednost
      }
      formData.append('Location', location);

      if (image) {
        formData.append('image', image);
      }

      console.log(formData);

      const response = await axios.post('http://localhost:5193/Hotel/AddHotel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);
      if (response.status === 200) {
        alert(`Uspešno dodavanje hotela ${name}`);
      }
    } catch (error) {
      console.error('Error adding Hotel:', error);
    }
  };

  const handleAddRoom = async () => {
    try {
      const characteristicsList = characteristics.replace(/\s+/g, '').split(',');
      const formData = new FormData();
      
      formData.append('RoomNumber', parseInt(roomNumber));
      formData.append('TypeOfRoom', typeOfRoom);
      formData.append('PriceForNight', parseFloat(priceForNight));
      formData.append('Characteristics', characteristicsList);
      formData.append('Description', roomDescription);
      formData.append('NumberOfPersons', numberOfPersons);

      if (roomImages.length !== 0) {
        roomImages.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await axios.put(`http://localhost:5193/Hotel/AddRoomToHotel/${hotelId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);
      if (response.status === 200) {
        alert(`Uspešno dodavanje sobe.`);
      }
    } catch (error) {
      console.error('Error adding Hotel room:', error);
    }
  };

  const handleUpdateHotel = async () => {
    try {
      const hotelData = {
        Id : hotelId,
        Name: name,
        Country: country,
        City: city,
        Address: address,
        Score: parseFloat(score),
        Description: description,
        Contact: contact,
        CenterDistance: parseFloat(centerDistance),
        BeachDistance: beachDistance ? parseFloat(beachDistance) : null,
        Location: location
      };

      const response = await axios.put('http://localhost:5193/Hotel/UpdateHotel', hotelData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response.data);
      if (response.status === 200) {
        alert(`Uspešno ažuriranje hotela ${name}`);
      }
    } catch (error) {
      console.error('Error updating Hotel:', error);
    }
  };

  const handleGetHotel = async () => {
    try {
      const response = await axios.get(`http://localhost:5193/Hotel/GetHotel/${hotelId}`); 
      setHotel(response.data); 
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const handleGetHotels = async () => {
    try {
      const response = await axios.get(`http://localhost:5193/Hotel/GetPageHotels/${page}`); 
      setHotels(response.data); 
      setCurrentAction('readFirst10'); 
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const handleDeleteHotel = async () => {
    try {
        const response = await axios.delete(`http://localhost:5193/Hotel/DeleteHotel/${hotelId}`);
        if(response.status === 200) {
            alert(`Uspešno brisanje hotela ${name}`);
        }
    } catch (error) {
        console.error("Error deleting hotel.");
    }
  }

  const renderContent = () => {
      switch (currentAction) {
        case 'create':
          return (
            <>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Naziv hotela :</Text>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Država :</Text>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Grad :</Text>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Adresa hotela :</Text>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Prosečna ocena :</Text>
                <Input
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Opis hotela :</Text>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Kontakt telefon :</Text>
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Udaljenost od centra :</Text>
                <Input
                  value={centerDistance}
                  onChange={(e) => setCenterDistance(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Udaljenost od plaže :</Text>
                <Input
                  value={beachDistance}
                  onChange={(e) => setBeachDistance(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Lokacija :</Text>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Slika :</Text>
                <Input 
                  type="file" 
                  id="dodatni-input" 
                  accept=".jpg" 
                  width='25%'
                  bg='#2a2629'
                  name="dodatniInput" 
                  onChange={handleFileChange}
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
                  onClick={handleAddHotel} 
                >
                  Dodaj
                </Button>
              </HStack>
            </>
          );
        case 'readHotel':
          return(
          <>
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
                onClick={handleGetHotel} 
              >
                Vrati
              </Button>
            </HStack>

            {hotel && (
              <VStack mt={10} display='flex' alignItems='flex-start'>
                <Text fontSize="lg" color="white">Naziv: {hotel.name}</Text>
                <Text fontSize="lg" color="white">Država: {hotel.country}</Text>
                <Text fontSize="lg" color="white">Grad: {hotel.city}</Text>
                <Text fontSize="lg" color="white">Adresa: {hotel.address}</Text>
                <Text fontSize="lg" color="white">Prosečna ocena: {hotel.score}</Text>
                <Text fontSize="lg" color="white">Opis: {hotel.description}</Text>
                <Text fontSize="lg" color="white">Kontakt: {hotel.contact}</Text>
                <Text fontSize="lg" color="white">Udaljenost od centra: {hotel.centerDistance} km</Text>

                {hotel.beachDistance !== null && (
                  <Text fontSize="lg" color="white">Udaljenost od plaže: {hotel.beachDistance} km</Text>
                )}

                {hotel.rooms && hotel.rooms.length > 0 && (
                  <VStack alignItems="flex-start" mt={4}>
                    <Text fontSize="lg" color="white" fontWeight="bold">Sobe:</Text>
                    {hotel.rooms.map((room, index) => (
                      <VStack key={index} alignItems="flex-start" p={2} bg="#2a2629" w='100%' borderRadius="md">
                        <Text fontSize="md" color="white">Broj sobe: {room.roomNumber}</Text>
                        <Text fontSize="md" color="white">Tip sobe: {room.typeOfRoom}</Text>
                        <Text fontSize="md" color="white">Cena za noć: {room.priceForNight} EUR</Text>
                        <Text fontSize="md" color="white">Opis sobe: {room.description}</Text>
                        {room.characteristics && room.characteristics.length > 0 && (
                          <VStack alignItems="flex-start" mt={2}>
                            <Text fontSize="md" color="white" fontWeight="bold">Karakteristike:</Text>
                            {room.characteristics.map((char, charIndex) => (
                              <Text key={charIndex} fontSize="md" color="white">- {char}</Text>
                            ))}
                          </VStack>
                        )}
                        <Text fontSize="md" color="white">Kapacitet: {room.numberOfPersons} osoba</Text>
                      </VStack>
                    ))}
                  </VStack>
                )}
              </VStack>
            )}
          </>
          );
        case 'readFirst10':
          return(
          <>
          {hotels.map((hotel) => {
              return <Text key={hotel.name} width="200px">{hotel.name}</Text>
          })}
          </>
          );
        case 'update':
          return (
              <>
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
                <Text width="200px">Naziv hotela :</Text>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Država :</Text>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Grad :</Text>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Adresa hotela :</Text>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Prosečna ocena :</Text>
                <Input
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Opis hotela :</Text>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Kontakt telefon :</Text>
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Udaljenost od centra :</Text>
                <Input
                  value={centerDistance}
                  onChange={(e) => setCenterDistance(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Udaljenost od plaže :</Text>
                <Input
                  value={beachDistance}
                  onChange={(e) => setBeachDistance(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Lokacija :</Text>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                  onClick={handleUpdateHotel} 
                >
                  Ažuriraj
                </Button>
              </HStack>
            </>
          );
        case 'updateAddRoom':
          return (
              <>
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
                <Text width="200px">Broj sobe :</Text>
                <Input
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Tip sobe :</Text>
                <Input
                  value={typeOfRoom}
                  onChange={(e) => setTypeOfRoom(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Cena za noć :</Text>
                <Input
                  value={priceForNight}
                  onChange={(e) => setPriceForNight(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Karakteristike :</Text>
                <Input
                  value={characteristics}
                  onChange={(e) => setCharacteristics(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Opis sobe :</Text>
                <Input
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4}>
                <Text width="200px">Broj osoba :</Text>
                <Input
                  value={numberOfPersons}
                  onChange={(e) => setNumberOfPersons(e.target.value)}
                  width="25%"
                  color='white'
                  p={3}
                  bg='#2a2629'
                />
              </HStack>
              <HStack width="100%" spacing={4} display='flex' alignItems='flex-end'>
                <VStack align="start">
                  {fileInputs.map((id, index) => (
                      <HStack width="100%" spacing={4} key={index}>
                      <Text width="200px">Slika {index + 1} :</Text>
                      <Input
                        ml={2}
                        key={id}
                        type="file"
                        accept=".jpg,.png,.jpeg"
                        bg="#2a2629"
                        name={`file-${index}`}
                        onChange={(e) => handleAddImage(e)}
                      />
                      </HStack>
                  ))}
                </VStack>
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
                    onClick={addFileInput}
                  >
                    +
                  </Button>
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
                  onClick={handleAddRoom} 
                >
                  Dodaj
                </Button>
              </HStack>
            </>
          );
        case 'delete':
          return (
              <>
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
                  onClick={handleDeleteHotel} 
                >
                  Obriši
                </Button>
              </HStack>
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
          Dodaj hotel
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
          onClick={() => setCurrentAction('readHotel')}
        >
          Vrati hotel
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
          onClick={handleGetHotels}
        >
          Vrati prvih 10
        </Button>
        <Button
          padding={3}
          backgroundColor='#fca130'
          variant="solid"
          _hover={{
            bg: '#e58f28 ',
            color: 'white',
            boxShadow: 'md',
            transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
          }}
          onClick={() => setCurrentAction('update')}
        >
          Ažuriraj hotel
        </Button>
        <Button
          padding={3}
          backgroundColor='#fca130'
          variant="solid"
          _hover={{
            bg: '#e58f28 ',
            color: 'white',
            boxShadow: 'md',
            transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
          }}
          onClick={() => setCurrentAction('updateAddRoom')}
        >
          Dodaj sobu
        </Button>
        <Button 
          padding={3}
          colorPalette="red"
          variant="solid"
          _hover={{
            bg: 'dark-red',
            color: 'white',
            boxShadow: 'md',
            transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
          }}
          onClick={() => setCurrentAction('delete')}
        >
          Obriši hotel
        </Button>
      </Grid>
      <VStack mt={20} align="flex-start" spacing={4} gap={4}>
        {renderContent()}
      </VStack>
    </Box>
    </div>
  )
}
