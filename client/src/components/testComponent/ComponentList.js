//SJSU CMPE 138 Spring 2022 TEAM3 

import React, { useContext, useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useParams } from 'react-router-dom';
import { fetchComponentListOfTestleadService, fetchComponentListOfProjectService } from '../../services/componentService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardHeader } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate, Navigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { AuthContext } from '../authentication/ProvideAuth';
import Image from '../../../src/img.jpg'; // Import using relative path
import { Paper } from '@mui/material';

const styles = {
  paperContainer: {
      backgroundImage: `url(${Image})`,

    height: "100vh"
  }
};


const ComponentList = (props) => {
  let id;
  const { source } = props;
  const params = useParams();
  if (source === 'testlead') {
    const { testlead_id } = params;
    id = testlead_id;

  }
  else {
    const { project_id } = params;
    id = project_id;
  }
  id = parseInt(id);

  const [componentListState, setComponentListState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  const contextValue = useContext(AuthContext);

  const fetchComponentListOfProject = async () => {
    const serviceResponse = await fetchComponentListOfProjectService(id);
    if (serviceResponse.status === 200) {
      setComponentListState(serviceResponse.data.payload);
    }
    else if (serviceResponse === 500) {
      setOpen(true);
      setMessage('Some error occured while fetching data');
    }
    else {
      setOpen(true);
      setMessage(serviceResponse.data.message);
      setAlertMessage(serviceResponse.data.message);
      setShowAlert(true);
    }
    setLoading(false);

  }
  const fetchComponentListOfTestlead = async () => {
    const serviceResponse = await fetchComponentListOfTestleadService(id);
    if (serviceResponse.status === 200) {
      setComponentListState(serviceResponse.data.payload);
      setLoading(false);
    }
    else if (serviceResponse === 500) {
      setOpen(true);
      setMessage('Some error occured while fetching data');
    }
    else {
      setOpen(true);
      setMessage(serviceResponse.message);
      setAlertMessage(serviceResponse.message);
      setShowAlert(true);
    }
    setLoading(false);

  }


  useEffect(() => {
    if (source === 'testlead') {
      fetchComponentListOfTestlead();
    }
    else {
      fetchComponentListOfProject();
    }
  }, []);


  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSnackbarClose = () => {
    setOpen(false);
  }

  const redirectToTestCases = (c_id) => {
    navigate(`/testCase_list/component/${c_id}`)
  }

  const redirectToComponentForm = (c_id) => {
    navigate(`/component/${c_id}`, { replace: true, state: { p_id: id } });
  }

  const redirectToAddComponentForm = () => {
    navigate("/component/new", { replace: true, state: { p_id: id } });
  }


  return (
    <>
    <Paper style={styles.paperContainer}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={message}
      />
      {loading ?
        (
          <CircularProgress color="success" />
        ) :
        (
          <React.Fragment>
            {source === 'project' && contextValue.user.type === 'testlead' && (<Button
              style={{ marginBottom: "15px", marginTop: "15px" }}
              onClick={redirectToAddComponentForm}
              variant={'contained'}
              color={'secondary'}
            >
              Add Component
            </Button>)
            }
            <div style={{ margin: 'auto', display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ bgcolor: '#e6ffe6', width: '80%' }} variant="outlined" >
                <CardHeader title="Components" />

                <CardContent >
                  {showAlert ? (
                    <Alert variant="filled" severity="warning">
                      {alertMessage}
                    </Alert>
                  ) : (componentListState.map((e) => {
                    const { c_id, c_name, c_desc, c_status } = e;
                    return (
                      <div style={{ padding: '15px' }}>
                        <Accordion expanded={expanded === c_id} onChange={handleChange(c_id)}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                          >
                            <Typography sx={{ width: '10%', flexShrink: 0 }}>
                              {c_name}
                            </Typography>
                            {/* <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography> */}
                          </AccordionSummary>
                          <AccordionDetails>
                            <Divider></Divider>
                            <div style={{ paddingTop: '25px' }}>
                              <Typography style={{ paddingBottom: '12px' }}>
                                {c_desc}
                              </Typography>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <Stack direction="row" spacing={2}>
                                {contextValue.user.type ==='testlead' && (<Button variant={'contained'} color={'secondary'} onClick={() => {redirectToComponentForm(c_id)}}>Update the Component</Button>)}
                                <Button onClick={() => {redirectToTestCases(c_id)}} variant={'contained'}>Test Cases</Button>
                              </Stack>

                            </div>

                          </AccordionDetails> 
                        </Accordion>
                      </div>
                    )
                  }))}
                </CardContent>
              </Card>
              
            </div>
            <Button style={{marginTop: '15px'}}variant={'contained'} onClick={() => {navigate(-1)}}>Go Back</Button>
          </React.Fragment>

        )

      }

</Paper>
    </>);
}

export default ComponentList;