import React from 'react'
import { Box, Card, HStack, VStack } from "@chakra-ui/react"
import { BsPersonCircle } from "react-icons/bs";
import ImageCarousel from '../ImageCarousel/ImageCarousel';

const ReservedRoomInfo = ({room,index,checkInDate,checkOutDate,}) => {
          
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
                <Card.Description fontSize='md' fontWeight='bold' >
                    <span>Broj sobe : {room.roomNumber || 'No description available.'}</span>
                    <br />
                    <span>{room.description || 'No description available.'}</span>
                </Card.Description>
                </Card.Body>
            </Box>
        </Card.Root>
     ) 
}

export default ReservedRoomInfo;
