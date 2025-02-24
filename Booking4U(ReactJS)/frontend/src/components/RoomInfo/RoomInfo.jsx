import React from 'react'
import { Box, Button, Card, HStack, Text } from "@chakra-ui/react"
import ImageCarousel from '../ImageCarousel/ImageCarousel';

const RoomInfo = ({room,index}) => {
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
                    <Box display='flex' flexDirection='column'> 
                        <Text/>Broj sobe : {room.roomNumber || 'No description available.'}
                        <Text/>{room.description || 'No description available.'}
                    </Box>
                </Card.Description>
                <HStack mt="4">
                <Box as="ul" mb="4" listStyleType="circle" display='flex' flexDirection='column'>
                    <li><strong>{room.priceForNight} EUR</strong></li>
                </Box>
                </HStack>
                <Card.Footer>
                    <Button 
                    width='200px'
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
                </Card.Footer>
                </Card.Body>
            </Box>
        </Card.Root>
     ) 
}

export default RoomInfo;
