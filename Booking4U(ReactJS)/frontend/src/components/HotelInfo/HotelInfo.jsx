import React from 'react'
import { Box, Card, Image } from "@chakra-ui/react";
import { Button } from "@/components/ui/button"

const HotelInfo = ({hotel, index}) => {
  return (
    <Card.Root 
        key={hotel.id || index} 
        maxW="sm" 
        overflow="hidden" 
        style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        flex: '1 1 300px', 
        }}
    >
        <Image
        alt={hotel.name} 
        src={hotel.image ? `data:image/jpeg;base64,${hotel.image}` : ''}
        style={{
            width: '100%', 
            height: '200px', 
            objectFit: 'cover', 
        }}
        />
        <Card.Body 
        style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            flexGrow: 1, 
            padding: '10px'
        }} 
        gap="2"
        >
        <Card.Title>{hotel.name}</Card.Title>
        <Card.Description>
            {hotel.description || 'No description available.'}
        </Card.Description>
        <Box as="ul" mb="4" listStyleType="circle" display='flex' flexDirection='column'>
            <li><strong>{hotel.city}, {hotel.country}</strong></li>
            <li><strong>Ul. {hotel.address}</strong></li>
            <li><strong>Lokacija: {hotel.location}</strong></li>
            <li><strong>Ocena: {hotel.score}</strong></li>
            <li><strong>Rastojanje od centra: {hotel.centerDistance} km</strong></li>
            <li><strong>Kontakt telefon: {hotel.contact}</strong></li>
            {hotel.beachDistance && (
            <li>
            <strong>Rastojanje od plaže: {hotel.beachDistance} km</strong>
            </li>
            )}
        </Box>
        <Button 
        padding={3} 
        colorPalette="whiteAlpha" 
        variant="solid"
        backgroundColor="#003580"
        _hover={{
            bg: "#0056A0",
            color: "white",
            boxShadow: "md",
            transition: "background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
        }}
        >
        Rezerviši
        </Button>
        </Card.Body>
    </Card.Root>
  )
}

export default HotelInfo