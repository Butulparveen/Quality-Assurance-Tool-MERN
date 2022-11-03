//SJSU CMPE 138 Spring 2022 TEAM3 

import React, { useState, useEffect, useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { addComponentService, fetchComponentDetailsService } from '../../services/componentService';
import { AuthContext } from '../authentication/ProvideAuth';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import { CardHeader } from '@mui/material';
import { checkEmptyFields } from '../../services/formValidationService';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useLocation } from 'react-router-dom';
import Image from '../../../src/img.jpg'; // Import using relative path
import { Paper } from '@mui/material';

const styles = {
  paperContainer: {
      backgroundImage: `url(${Image})`,

    height: "100vh"
  }
};


const CreateComponent = () => {
  const [componentState, setComponentState] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const contextValue = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const {state} = location;

  const fetchComponentDetails = async (id) => {
    setLoading(true);
    const serviceResponse = await fetchComponentDetailsService(id);
    if (serviceResponse.status === 200) {
      setComponentState(serviceResponse.data.payload[0]);
      setLoading(false);
    }
    else {
      setOpen(true);
      setMessage('Some Error Occured while fetching data');
    }
  }

  useEffect(() => {
    const { e_id: testlead_id } = contextValue.user;
    setComponentState({
      ...componentState,
      testlead_id
    })
    if (params.id !== 'new') { //update Project
      fetchComponentDetails(params.id);
    }
    else {
      setComponentState({
        ...componentState,
        c_status: 'TestReady',
        project_id: state.p_id,
        testlead_id: contextValue.user.e_id
      })
      setLoading(false);
    }
  }, [])

  const handleFormChange = (e) => {
    setComponentState({
      ...componentState,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async () => {
    if (checkEmptyFields(componentState) === true) {
      const serviceResponse = await addComponentService(componentState);
      if (serviceResponse.status === 200) {
        setOpen(true);
        setMessage('Operation Successfull');
        setTimeout(() => { navigate('/Dashboard'); }, 2500)

      }
      else {
        setOpen(true);
        setMessage('Some Error Occured');
      }
    }
    else {
      setOpen(true);
      setMessage('Please Fill out all the fields');
    }
  }
  const handleMarkAsComplete = async() => {
    let c_status;
    if(componentState.c_status === 'Completed'){
      c_status = 'TestReady';
    }
    else{
      c_status = 'Completed'
    }
    setComponentState({
      ...componentState,
      c_status
    });
  }

  const handleClose = () => {
    setOpen(false);
  }
  return (
    <React.Fragment>
      <Paper style={styles.paperContainer}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
      />
      {loading ? (
        <CircularProgress color="success" />

      ) : (

        <>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card variant="outlined" sx={{ bgcolor: '#AEC6CF', width: '80%' }}>
              <CardHeader title="Component Details">
              </CardHeader>
              <CardContent>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <h2>Project ID: {state.p_id}</h2>

                </div>
                <TextField
                  id="c_name"
                  name="c_name"
                  label="Name"
                  fullWidth
                  autoComplete="Source"
                  variant="standard"
                  onChange={handleFormChange}
                  value={componentState.c_name}
                />
                <br></br>
                <br></br>
                <TextField
                  id="c_desc"
                  name="c_desc"
                  label="Description"
                  fullWidth
                  autoComplete="Source"
                  variant="standard"
                  onChange={handleFormChange}
                  value={componentState.c_desc}
                />
                <br></br>
                <br></br>
                <div>
                  <Chip 
                    color={componentState.c_status === 'TestReady'  ? 'warning' : 'success' } 
                    label={params.id === 'new' ? 'TestReady' : componentState.c_status }/>
                </div>
              </CardContent>
              <CardActions style={{ justifyContent: 'center' }}>
              <Stack direction="row" spacing={2}>
                {params.id !== 'new' && (
                <Button variant={'contained'} onClick={handleMarkAsComplete}>
                  {componentState.c_status === 'TestReady' ? 'Mark as Complete' : 'Mark as Test Ready' }
                </Button>)}
                <Button variant={'contained'} onClick={handleSubmit}>Submit</Button>
              </Stack>
              </CardActions>
            </Card>
          </div>
          <Button style={{marginTop: '15px'}}variant={'contained'} onClick={() => {navigate(-1)}}>Go Back</Button>
        </>


      )}

</Paper>
    </React.Fragment>);
}

export default CreateComponent;

