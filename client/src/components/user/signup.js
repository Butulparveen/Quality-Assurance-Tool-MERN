//SJSU CMPE 138 Spring 2022 TEAM3 

import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate, useNavigate } from "react-router";
import { signup } from '../../services/authenticationService';
import { AuthContext } from '../authentication/ProvideAuth';
import Snackbar from '@mui/material/Snackbar';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Signup() {

  const history = useNavigate();

  const authContext = useContext(AuthContext);
  const [persona, setPersona] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { setUser, setAuthState, updateLocalStorage } = authContext;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var manager = data.get('manager');
    var testlead = data.get('testlead');
    var tester = data.get('tester');
    var developer = data.get('developer');
    var persona;
    if (manager === 'on') persona = "manager";
    if (testlead === 'on') persona = "testlead";
    if (tester === 'on') persona = "tester";
    if (developer === 'on') persona = "developer";
    // eslint-disable-next-line no-console
    if(persona === undefined){
      setOpen(true);
      setMessage("Please Enter the role");
      return;
    }

    var data1 = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      pwd: data.get('password'),
      type: persona,
    };
    
    const response = await signup(data1);
    if (response.status === 200) {
      setUser(response.data);
      setAuthState(true);
      updateLocalStorage(response.data); //Need to call after setUser
      setTimeout(() => {
        history('/login');
      }, 500);

    }
    else {
      setAuthState(false);
      console.log('Error', response);
      setOpen(true);
      setMessage(response.data.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
  } 
  return (
    <>
    <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
      />
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://www.rue-web.com/wp-content/uploads/2021/12/QA-tester.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <br></br>
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <div class="form-check form-check-inline">
                    <input
                      checked={persona === 'manager'}
                      class="form-check-input"
                      type="radio"
                      name="manager"
                      id="manager"
                      onClick={() => { setPersona('manager') }}
                    />
                    <label
                      class="form-check-label" for="manager">
                      Manager
                    </label>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div class="form-check form-check-inline">
                    <input
                      checked={persona === 'testlead'}
                      class="form-check-input"
                      type="radio"
                      name="testlead"
                      id="testlead"
                      onClick={() => { setPersona('testlead') }}
                    />
                    <label class="form-check-label" for="testlead">
                      Test Lead
                    </label>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div class="form-check form-check-inline">
                    <input
                      checked={persona === 'tester'}
                      class="form-check-input"
                      type="radio"
                      name="tester"
                      id="tester"
                      onClick={() => { setPersona('tester') }}
                    />
                    <label class="form-check-label" for="tester">
                      Tester
                    </label>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div class="form-check form-check-inline">
                    <input
                      checked={persona === 'developer'}
                      class="form-check-input"
                      type="radio"
                      name="developer"
                      id="developer"
                      onClick={() => { setPersona('developer') }}
                    />
                    <label class="form-check-label" for="developer">
                      Developer
                    </label>
                  </div>
                </Grid>

              </Grid>

              <br></br>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
    </>
  );
}