//SJSU CMPE 138 Spring 2022 TEAM3 

import React, { useState, useEffect, useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { addProjectService, fetchProjectDetailsService } from '../../services/projectService';
import { AuthContext } from '../authentication/ProvideAuth';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import { CardHeader } from '@mui/material';
import { checkEmptyFields } from '../../services/formValidationService';
import Image from '../../../src/img.jpg'; // Import using relative path
import { Paper } from '@mui/material';

const styles = {
  paperContainer: {
      backgroundImage: `url(${Image})`,

    height: "100vh"
  }
};


const CreateProject = () => {

  const [projectState, setProjectState] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const contextValue = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchProjectDetails = async (id) => {
    setLoading(true);
    const serviceResponse = await fetchProjectDetailsService(id);
    if (serviceResponse.status === 200) {
      setProjectState(serviceResponse.data.payload[0]);
      setLoading(false);
    }
    else {
      setOpen(true);
      setMessage('Some Error Occured while fetching data');
    }
  }

  useEffect(() => {
    const { e_id: manager_id } = contextValue.user;
    setProjectState({
      ...projectState,
      manager_id
    })
    if (params.id !== 'new') { //update Project
      fetchProjectDetails(params.id);
    }
    else {

      setLoading(false);
    }
  }, [])

  const handleFormChange = (e) => {
    setProjectState({
      ...projectState,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {

    setProjectState({
      ...projectState,
    });
    if (checkEmptyFields(projectState) === true) {
      const serviceResponse = await addProjectService(projectState);
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

  const handleClose = () => {
    setOpen(false);
  }
  return (
    <React.Fragment>
      <Paper style={styles.paperContainer}>
        {/* </Paper> */}
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
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <Card variant="outlined" sx={{bgcolor: '#AEC6CF', width: '80%'}}>
              <CardHeader title="Project Details">

              </CardHeader>
              <CardContent>
                <TextField
                  id="o_name"
                  name="p_name"
                  label="Name"
                  fullWidth
                  autoComplete="Source"
                  variant="standard"
                  onChange={handleFormChange}
                  value={projectState.p_name}
                  backgroundColor= "#21b6ae"
                />
                <br></br>
                <br></br>
                <br></br>
                <TextField
                  id="p_desc"
                  name="p_desc"
                  label="Description"
                  fullWidth
                  autoComplete="Source"
                  variant="standard"
                  onChange={handleFormChange}
                  value={projectState.p_desc}
                />
                <br></br>
                <br></br>
              </CardContent>
              <CardActions style={{justifyContent:'center'}}>
                <Button style={{backgroundColor: "#21b6ae"}} variant={'contained'} onClick={handleSubmit}>Submit</Button>
              </CardActions>
            </Card>
          </div>
          <Button style={{marginTop: '15px',  backgroundColor: "#21b6ae"}}variant={'contained'} onClick={() => {navigate(-1)}}>Go Back</Button>

        </>


      )}

     </Paper>
    </React.Fragment>);

}

export default CreateProject;

