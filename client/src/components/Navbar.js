//SJSU CMPE 138 Spring 2022 TEAM3 

import React, { Component, useCallback, useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from './authentication/ProvideAuth';
const NavBar = () => {

  // const history = useNavigate();
  // const redirectToDashboard = () => {
  //     history('/Dashboard');
  // }
  const contextValue = useContext(AuthContext);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = contextValue;
  // console.log(contextValue);
  return (
    <div style={{ marginBottom: '60px' }}>
      <AppBar position="fixed" sx={{ bgcolor: "black" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Spartan QA Tool
          </Typography>
          {isAuthenticated &&
            (
              <>
              {/* <Typography style={{color:'white'}} variant="h7" component="div" sx={{ flexGrow: 1 }}>
                {user.firstName}
              </Typography> */}
              <Button style={{color:'white'}} onClick={() => { logout(); navigate('/login');}}>Logout</Button>
              </>
            )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;