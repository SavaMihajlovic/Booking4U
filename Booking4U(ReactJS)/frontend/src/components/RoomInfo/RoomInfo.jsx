import React from 'react'
import { Box, Button, Card, HStack, VStack } from "@chakra-ui/react"
import { BsPersonCircle } from "react-icons/bs";
import ImageCarousel from '../ImageCarousel/ImageCarousel';

const RoomInfo = ({room,index,checkInDate,checkOutDate,
                   roomsForReservation,setRoomsForReservation}) => {

    const isReserved = roomsForReservation.includes(room.roomNumber);

    const handleReservationToggle = () => {
        if (!checkInDate || !checkOutDate) return;

        let updatedRooms;
        if (isReserved) {
            updatedRooms = roomsForReservation.filter(num => num !== room.roomNumber);
        } else {
            updatedRooms = [...roomsForReservation, room.roomNumber];
        }
        setRoomsForReservation(updatedRooms);
    };              

  return (
        <Card.Root 
            key={room.id || index} 
            flexDirection="row" 
            overflow="hidden" 
            maxW="xl"
            style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 4fr',
            minWidth: '100%',
            height: '100%'
            }}
        >
            <Box 
                style={{
                    position: "relative", 
                    width: "100%", 
                    paddingBottom: "100%", 
                    overflow: "hidden"
                }}
            >
                <ImageCarousel images={room.images}/>
            </Box>
            <Box>
                <Card.Body 
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    flexGrow: 1, 
                    padding: '10px'
                }} 
                gap="2"
                >
                <Card.Title>{room.typeOfRoom}</Card.Title>
                <Card.Description fontSize='md'>
                    <span>Broj sobe : {room.roomNumber || 'No description available.'}</span>
                    <br />
                    <span>{room.description || 'No description available.'}</span>
                </Card.Description>
                <VStack mt="2" alignItems='flex-start'>
                <Box as="ul" display='flex' flexDirection='column'>
                    <HStack>
                        <BsPersonCircle style={{ marginBottom: '1px' }} size={20}/>
                        <strong>: {room.numberOfPersons}</strong>
                    </HStack>
                </Box>
                <Box as="ul" mb="2" display='flex' flexDirection='column'>
                    <strong>{room.priceForNight} EUR</strong>
                </Box>
                </VStack>
                <Card.Footer>
                    <Button 
                    width='250px'
                    padding={3} 
                    disabled={!checkInDate || !checkOutDate}
                    colorPalette="whiteAlpha" 
                    variant="solid"
                    backgroundColor={isReserved ? "red.500" : "#003580"}
                    _hover={{
                        bg: isReserved ? "red.600" : "#0056A0",
                        color: "white",
                        boxShadow: "md",
                        transition: "background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onClick={handleReservationToggle}
                    >
                    {!checkInDate || !checkOutDate 
                        ? "Unesite datume prijave i odjave" 
                        : isReserved 
                            ? "Poništi rezervaciju" 
                            : "Rezerviši"}
                    </Button>
                </Card.Footer>
                </Card.Body>
            </Box>
        </Card.Root>
     ) 
}

export default RoomInfo;
