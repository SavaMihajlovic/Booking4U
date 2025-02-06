import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { HashLink } from 'react-router-hash-link';
import { Avatar } from "@/components/ui/avatar"
import { UserFetch } from '../UserFetch/UserFetch';
import { FaFilter } from "react-icons/fa";

const Navbar = ({ setLoginDialogOpen, filterOpen, setFilterOpen}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userType, setUserType] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await UserFetch();
          setUser(userData);
          setUserType(userData.TypeOfUser);
        } catch (error) {
          console.error('Invalid token', error);
          setUser(null);
          setUserType('');
        }
      } else {
        setUser(null);
        setUserType('');
      }
    };

    fetchUser();

  }, [navigate]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClick = () => {
    setMenuOpen(false);
  };

  const handleLoginClick = () => {
    setMenuOpen(false);
    setLoginDialogOpen(true);
    setFilterOpen(false);
  };

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const handleFilterClick = () => {
    setFilterOpen(!filterOpen);
    setLoginDialogOpen(false);
  };

  const getMenuItems = () => {
    switch(userType) {
      case 'user':
        return (
          <>
              <li><HashLink to="/user" onClick={handleMenuClick}>Početna</HashLink></li>
              <li><HashLink to="/" onClick={handleLogout}>Odjava</HashLink></li>
              <li className={styles.avatarContainer}>
                  <Avatar
                    className={styles['avatar-padding']}
                    size="sm"
                    variant="subtle"
                    name={`${user?.FirstName || ''} ${user?.LastName || ''}`}
                  />
                  <span className={styles.userData}><strong>{user.FirstName} {user.LastName}</strong></span>
              </li>
          </>
        );
      case 'admin':
        return (
          <>
              <li><HashLink to="/admin" onClick={handleMenuClick}>Početna</HashLink></li>
              <li><HashLink to="/" onClick={handleLogout}>Odjava</HashLink></li>
          </>
        );
      default:
      return (
        <>
            <li><HashLink to="/" onClick={handleMenuClick}>Početna</HashLink></li>
            <li><HashLink to="/" onClick={handleLoginClick}>Prijava</HashLink></li>
        </>
      );
    }
  };

  return (
    <header>
      <div className={`${styles.navbarOverlay}`}></div>

      <div className={`${styles.titleAndFilter}`}>
      <FaFilter
        className="filter-icon"
        style={{
          fontSize: '27px',
          cursor: 'pointer',
          color: filterOpen ? '#339dff' : 'white', 
          transition: 'color 0.3s ease, transform 0.3s ease',
          transform: filterOpen ? 'scale(1.2)' : 'scale(1)', 
        }}
        onClick={handleFilterClick}
      />
      <HashLink to="/" className="logo">
        Booking4U
      </HashLink>
      </div>
      <ul className={menuOpen ? "navbar open" : "navbar"}>
        {getMenuItems()}
      </ul>
    </header>
  );
};

export default Navbar;
