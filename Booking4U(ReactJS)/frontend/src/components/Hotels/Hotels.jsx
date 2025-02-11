import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HStack } from "@chakra-ui/react"
import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot,
} from "@/components/ui/pagination"
import HotelInfo from '../HotelInfo/HotelInfo';
import styles from './Hotels.module.css';
import Sidebar from '../Sidebar/Sidebar';

const Hotels = ({filterOpen,setLoginDialogOpen}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [hotels, setHotels] = useState([]);
    const [hotelsCount, setHotelsCount] = useState(0);
    const [filteredHotels, setFilteredHotels] = useState([]);

    useEffect(() => {  
        const fetchHotels = async () => {
          try {
            const allHotelsResponse = await axios.get("http://localhost:5193/Hotel/GetAllHotels");
            allHotelsResponse.status === 200 ? setHotelsCount(allHotelsResponse.data.length) : console.error("Error fetching all hotels.");

            const response = await axios.get(`http://localhost:5193/Hotel/GetPageHotels/${currentPage}`);
            response.status === 200 ? setHotels(response.data) : console.error("Error fetching hotels.");
          } catch (error) {
            console.error('Greska u pribavljanju hotela.', error);
          }
        };
        fetchHotels();

      }, [currentPage]);

    const handlePageChange = async (src) => {
        const newPage = Number(src.page);
        setCurrentPage(newPage);
        await new Promise(resolve => setTimeout(resolve, 500));  
        const element = document.getElementById("hotels");
        element.scrollIntoView({ behavior: "smooth", block: "start" });
    }; 

    return (
        <>
        <div className={!filterOpen ? 'sekcije' : `${styles.filterSekcije}`}>
            {filterOpen && (
                <Sidebar setFilteredHotels={setFilteredHotels} currentPage={currentPage}/>
            )}
            <section id="hotels">
                <div className="items-container">
                    <div className="menu-container">
                    {(filteredHotels.length > 0 ? filteredHotels : hotels)
                    .map((hotel, index) => (
                        <HotelInfo hotel={hotel} key={index} setLoginDialogOpen={setLoginDialogOpen} />
                    ))}
                    </div>
                    <section id="pagination">
                        <PaginationRoot count={hotelsCount} pageSize={10} defaultPage={1} size='md' onPageChange={handlePageChange} >
                            <HStack justify="center">
                            <PaginationPrevTrigger style={{backgroundColor :'#fff'}} _hover={{color: 'black'}}/>
                            <PaginationItems style={{backgroundColor :'#fff' , fontWeight: 'bold'}} _hover={{color: 'black'}} />
                            <PaginationNextTrigger style={{backgroundColor :'#fff'}} _hover={{color: 'black'}}/>
                            </HStack>
                        </PaginationRoot>
                    </section>
                </div>
            </section>
        </div>
        </>
    )
}

export default Hotels;