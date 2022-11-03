//SJSU CMPE 138 Spring 2022 TEAM3 

import React, { useState, useEffect, useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { addTestCaseService, fetchTestCaseDetailsService } from '../../services/testCaseService';
import { AuthContext } from '../authentication/ProvideAuth';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import { CardHeader } from '@mui/material';
import { checkEmptyFields } from '../../services/formValidationService';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useLocation } from 'react-router-dom';
import { getNextStatus } from '../../services/testCaseService';
import Drawer from '@mui/material/Drawer';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { getDeveloperListService } from '../../services/developerService';
import { addBugService } from '../../services/bugService';
import Box from '@mui/material/Box';
import Image from '../../../src/img.jpg'; // Import using relative path
import { Paper } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';


const styles = {
  paperContainer: {
    backgroundImage: `url(${Image})`,

    height: "100vh"
  }
};


const CreateTestCase = () => {
  const [testCaseState, setTestCaseState] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({});
  const [drawerState, setDrawerState] = useState(false);
  const [developerState, setDeveloperState] = useState();
  const [originalStatus, setOriginalStatus] = useState();
  const [developerListState, setDeveloperListState] = useState([]);
  const [drawerLoading, setDrawerLoadingState] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const contextValue = useContext(AuthContext);
  const { state } = location;
  const fetchDeveloperList = async () => {
    setDrawerLoadingState(true);
    const serviceResponse = await getDeveloperListService();
    if (serviceResponse.status === 200) {
      setDeveloperListState(serviceResponse.data.payload);
    }
    else {
      setOpen(true);
      setMessage('Some error Occures');
    }
    setDrawerLoadingState(false);
  }


  const fetchTestCaseDetails = async (id) => {
    setLoading(true);
    const serviceResponse = await fetchTestCaseDetailsService(id);
    if (serviceResponse.status === 200) {
      setTestCaseState(serviceResponse.data.payload[0]);
      setOriginalStatus(serviceResponse.data.payload[0]['tc_status']);
      setStatus({
        ...status,
        current: serviceResponse.data.payload[0]['tc_status'],
        new: getNextStatus(serviceResponse.data.payload[0]['tc_status']),
        selected: serviceResponse.data.payload[0]['tc_status']
      });
      setLoading(false);
    }
    else {
      setOpen(true);
      setMessage('Some Error Occured while fetching data');
    }
  }

  useEffect(() => {
    const { e_id: tester_id } = contextValue.user;
    setTestCaseState({
      ...testCaseState,
      tester_id: tester_id,
      component_id: state.c_id
    });
    if (params.id !== 'new') { //update Project
      fetchTestCaseDetails(params.id);
    }
    else {
      setTestCaseState({
        ...testCaseState,
        tc_status: 'ToDo',
        tester_id: tester_id,
        component_id: state.c_id
      })

      setLoading(false);
    }
  }, [])

  const handleFormChange = (e) => {
    setTestCaseState({
      ...testCaseState,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async () => {
    if (checkEmptyFields(testCaseState) === true) {
      const serviceResponse = await addTestCaseService(testCaseState);
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

  const handleDeveloperListChange = (event) => {
    setDeveloperState(event.target.value);
  };


  const handleStatusChange = (selected, current) => {
    setStatus({
      ...status,
      current,
      new: [].concat(status.current),
      selected,
    })
    setTestCaseState({
      ...testCaseState,
      tc_status: selected
    })
  }

  const handleClose = () => {
    setOpen(false);
  }

  const toggleDrawer = (toggle) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    fetchDeveloperList();
    setDrawerState(toggle);
  };

  const submitBug = async () => {
    const { e_id: tester_id } = contextValue.user;
    const bug = {
      b_status: 'ToDo',
      created_by: parseInt(tester_id),
      resolved_by: parseInt(developerState),
      testcase_id: testCaseState.tc_id
    };
    const serviceResponse = await addBugService(bug);
    if (serviceResponse.status === 200) {
      setOpen(true);
      setMessage('Operation Successfull');
      setDrawerState(false);
      setTestCaseState({
        ...testCaseState,
        tc_status: 'Blocked'
      });
      handleSubmit();
    }
    else {
      setOpen(true);
      setMessage('Error Occured');
      setDrawerState(false);
    }
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
                <CardHeader title="Test Case Details">
                </CardHeader>
                <CardContent>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h2>Component ID: {state.c_id}</h2>
                  </div>
                  <TextField
                    id="tc_name"
                    name="tc_name"
                    label="Name"
                    fullWidth
                    autoComplete="Source"
                    variant="standard"
                    onChange={handleFormChange}
                    value={testCaseState.tc_name}
                  />
                  <br></br>
                  <br></br>
                  <TextField
                    id="tc_desc"
                    name="tc_desc"
                    label="Description"
                    fullWidth
                    autoComplete="Source"
                    variant="standard"
                    onChange={handleFormChange}
                    value={testCaseState.tc_desc}
                  />
                  <br></br>
                  <br></br>
                  <InputLabel id="demo-simple-select-label">Mode of Execution</InputLabel>
                  <Select
                    name="mode_of_execution"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={testCaseState.mode_of_execution}
                    label="Mode of executuion"
                    onChange={handleFormChange}
                    autoWidth
                  >
                    <MenuItem value={'Manual'}>Manual</MenuItem>
                    <MenuItem value={'Automated'}>Automated</MenuItem>
                  </Select>
                  <br></br>
                  <br></br>
                  <div>
                    <Chip
                      color={testCaseState.c_status === 'TestReady' ? 'warning' : 'success'}
                      label={params.id === 'new' ? 'TestReady' : status.selected} />
                  </div>
                </CardContent>
                <CardActions style={{ display: 'flex', justifyContent: 'center' }} >
                  <Stack>
                    <div>
                      <Stack direction="row" spacing={2}>
                        {params.id !== 'new' && (
                          <>
                            {status.new && status.new.length > 0 && status.new.map((e) => {
                              return (<Button variant={'contained'} onClick={() => { handleStatusChange(e, status.new) }}>{e}</Button>)
                            })}
                          </>
                        )}
                        <Button variant={'contained'} onClick={handleSubmit}>Submit</Button>
                      </Stack>
                    </div>
                    <br></br>
                    {(originalStatus === 'Failed') && (
                      <>
                        <div style={{ color: "red" }}>
                          This test case is Failed
                        </div>
                        <Button variant={'contained'} onClick={toggleDrawer(true)}>
                          Report Bug
                        </Button>
                      </>
                    )}
                  </Stack>

                </CardActions>
              </Card>
            </div>
            <Button style={{ marginTop: '15px' }} variant={'contained'} onClick={() => { navigate(-1) }}>Go Back</Button>
          </>


        )}
        <Drawer
          anchor={'right'}
          open={drawerState}
          onClose={toggleDrawer(false)}
        >
          <>
            {drawerLoading ? (<CircularProgress color="success" />) :

              (
                <>
                  <Box
                    sx={{ width: 300 }}
                    role="presentation"
                  // onClick={toggleDrawer(false)}
                  // onKeyDown={toggleDrawer(false)}
                  >
                    <Stack>
                      <Button onClick={toggleDrawer(false)} variant={'contained'} color={'secondary'}>Close</Button>
                      <br></br>
                      <FormControl style={{ paddingLeft: '20px' }}>
                        <FormLabel id="demo-controlled-radio-buttons-group">Developers</FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={developerState}
                          onChange={handleDeveloperListChange}
                        >
                          {developerListState.map((dev) => {
                            return (
                              <FormControlLabel value={dev.e_id} control={<Radio />} label={dev.firstName} />
                            )
                          })}
                        </RadioGroup>
                      </FormControl>
                      <Button variant={'contained'} onClick={submitBug}>Report Bug</Button>
                    </Stack>
                  </Box>
                </>
              )}

          </>
        </Drawer>
      </Paper>
    </React.Fragment >);
}

export default CreateTestCase;
