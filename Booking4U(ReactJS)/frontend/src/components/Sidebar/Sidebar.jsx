import React, { useEffect, useState } from 'react'
import styles from './Sidebar.module.css'
import {
  MenuContent,
  MenuRadioItem,
  MenuRadioItemGroup,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu"
import { VStack, Input, Box, Button } from "@chakra-ui/react"
import axios from 'axios'

const Sidebar = ({setFilteredHotels,currentPage,setIsFiltered}) => {

  const [roomTypes, setRoomTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('');
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({
    city: '', 
    score: '', 
    centerDistance: '', 
    typeOfRoom: '', 
    priceForNight: '', 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomTypesResponse = await axios.get("http://localhost:5193/Hotel/GetAllRoomTypes");
        setRoomTypes(roomTypesResponse.data);

        const countriesResponse = await axios.get("http://localhost:5193/Hotel/GetAllCountries");
        setCountries(countriesResponse.data);

        if(country !== '') {
          const citiesResponse = await axios.get(`http://localhost:5193/Hotel/GetAllCities/${country}`);
          setCities(citiesResponse.data);
        }
      } catch (err) {
        console.error("Greska u pribavljanju tipova soba.");
      }
    }

    fetchData();
  }, [country]);

  const handleConfirmFilters = async () => {
    try {
      const filterRequest = {
        city: filters.city ? filters.city : null,  
        score: filters.score ? parseFloat(filters.score) : null, 
        centerDistance: filters.centerDistance ? parseFloat(filters.centerDistance) : null, 
        typeOfRoom: filters.typeOfRoom ? filters.typeOfRoom : null,  
        priceForNight: filters.priceForNight ? parseInt(filters.priceForNight) : null,  
        page: currentPage
      };

      const response = await axios.get("http://localhost:5193/Hotel/GetHotelsFilter", { params: filterRequest });

      if (response.status === 200) {
          setFilteredHotels(response.data);
          setIsFiltered(true);
      } else {
        console.error('Greška u odgovoru:', response.status);
      }

    } catch (err) {
      console.error('Greška u slanju filtera:', err);
    }
  };

  return (
    <div className={`${styles.filterSection}`}>
      <VStack gap='4' style={{ alignItems: 'start', marginTop: '20px', width: '100%' }}>
        <Box style={{ fontWeight: 'bold', fontSize: '18px' }}>Država</Box>
        <MenuRoot>
          <MenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              style={{
                backgroundColor: 'white',
                width: '150px',
                padding: '10px',
                marginRight: '35px',
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
              }}
            >
              <span style={{ color: 'black', fontWeight: 'bold' }}>Izaberi državu</span>
            </Button>
          </MenuTrigger>
          <MenuContent
            style={{
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              minWidth: '180px',
              border: '1px solid #ccc',
              color: 'white'
            }}
          >
            <MenuRadioItemGroup
              value={country}
              onValueChange={(e) => {
                setCountry(e.value);
              }}
              style={{ marginTop: '5px', color: 'black'}}
            >
            {countries.map((c, index) => {
              return (
                <MenuRadioItem
                  key={index}
                  value={c}
                  style={{
                    fontSize: '16px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s ease',
                    marginBottom: '5px',
                    marginRight: '25px',
                  }}
                >
                  {c}
                </MenuRadioItem>
              );
            })}
            </MenuRadioItemGroup>
          </MenuContent>
        </MenuRoot>
      </VStack>
      
      <VStack gap='4' style={{ alignItems: 'start', marginTop: '20px', width: '100%' }}>
        <Box style={{ fontWeight: 'bold', fontSize: '18px' }}>Grad</Box>
        <MenuRoot>
          <MenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              style={{
                backgroundColor: 'white',
                width: '150px',
                padding: '10px',
                marginRight: '35px',
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
              }}
              disabled={country === ''}
            >
              <span style={{ color: 'black', fontWeight: 'bold' }}>{country === '' ? 'Izaberi prvo državu' : 'Izaberi grad'}</span>
            </Button>
          </MenuTrigger>
          <MenuContent
            style={{
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              minWidth: '180px',
              border: '1px solid #ccc',
              color: 'white'
            }}
          >
            <MenuRadioItemGroup
              value={filters.city}
              onValueChange={(e) => {
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  city: e.value,
                }));
              }}
              style={{ marginTop: '5px', color: 'black'}}
            >
            {cities.map((c, index) => {
              return (
                <MenuRadioItem
                  key={index}
                  value={c}
                  style={{
                    fontSize: '16px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s ease',
                    marginBottom: '5px',
                    marginRight: '25px',
                  }}
                >
                  {c}
                </MenuRadioItem>
              );
            })}
            </MenuRadioItemGroup>
          </MenuContent>
        </MenuRoot>
      </VStack>

      <VStack gap='4' style={{ alignItems: 'start', marginTop: '20px', width: '100%' }}>
        <Box style={{ fontWeight: 'bold', fontSize: '18px' }}>Minimalna ocena</Box>
        <Input 
          placeholder="Unesite ocenu"
          value={filters.score}
          onChange={(e) => setFilters(prevState => ({
            ...prevState,
            score: e.target.value
          }))}
          style={{
            padding: '5px',
            color: 'white',
            backgroundColor: '#2a2629',
            width: '100%'
          }} 
          _placeholder={{ color: "#888888" }}
        />
      </VStack>

      <VStack gap='4' style={{ alignItems: 'start', marginTop: '20px', width: '100%' }}>
        <Box style={{ fontWeight: 'bold', fontSize: '18px' }}>Udaljenost od centra</Box>
        <Input 
          placeholder="0 - 10 km"
          value={filters.centerDistance}
          onChange={(e) => setFilters(prevState => ({
            ...prevState,
            centerDistance: e.target.value
          }))}
          style={{
            padding: '5px',
            color: 'white',
            backgroundColor: '#2a2629',
            width: '100%'
          }} 
          _placeholder={{ color: "#888888" }}
        />
      </VStack>

      <VStack gap='4' style={{ alignItems: 'start', marginTop: '20px', width: '100%' }}>
        <Box style={{ fontWeight: 'bold', fontSize: '18px' }}>Tip sobe</Box>
        <MenuRoot>
          <MenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              style={{
                backgroundColor: 'white',
                width: '150px',
                padding: '10px',
                marginRight: '35px',
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
              }}
            >
              <span style={{ color: 'black', fontWeight: 'bold' }}>Izaberi tip sobe</span>
            </Button>
          </MenuTrigger>
          <MenuContent
            style={{
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              minWidth: '180px',
              border: '1px solid #ccc',
              color: 'white'
            }}
          >
            <MenuRadioItemGroup
              value={filters.typeOfRoom}
              onValueChange={(e) => {
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  typeOfRoom: e.value,
                }));
              }}
              style={{ marginTop: '5px', color: 'black'}}
            >
            {roomTypes.map((rt, index) => {
              return (
                <MenuRadioItem
                  key={index}
                  value={rt}
                  style={{
                    fontSize: '16px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s ease',
                    marginBottom: '5px',
                    marginRight: '25px',
                  }}
                >
                  {rt}
                </MenuRadioItem>
              );
            })}
            </MenuRadioItemGroup>
          </MenuContent>
        </MenuRoot>
      </VStack>

      <VStack gap='4' style={{ alignItems: 'start', marginTop: '20px', width: '100%' }}>
        <Box style={{ fontWeight: 'bold', fontSize: '18px' }}>Cena smeštaja za noć</Box>
        <Input 
          placeholder="Unesite maksimalni iznos"
          value={filters.priceForNight}
          onChange={(e) => setFilters(prevState => ({
            ...prevState,
            priceForNight: e.target.value
          }))}
          style={{
            padding: '5px',
            color: 'white',
            backgroundColor: '#2a2629',
            width: '100%'
          }} 
          _placeholder={{ color: "#888888" }}
        />
      </VStack>

      <Button
        w='100%'
        marginTop={10}
        padding={3} 
        backgroundColor='#003580'
        variant="solid"
        _hover={{
          bg: "#0056A0",
          color: "white",
          boxShadow: "md",
          transition: "background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
        }}
        onClick={handleConfirmFilters}
      >
        Primeni filtere
      </Button>
    </div>
  )
}

export default Sidebar;
