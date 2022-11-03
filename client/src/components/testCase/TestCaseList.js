//SJSU CMPE 138 Spring 2022 TEAM3 

import React, { useContext, useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useParams } from 'react-router-dom';
import { fetchTestCaseListOfComponentService, fetchTestCaseListOfTesterService } from '../../services/testCaseService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardHeader } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
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


const TestCaseList = (props) => {
  let id;
  const { source } = props;
  const params = useParams();
  if (source === 'tester') {
    const { tester_id } = params;
    id = tester_id;

  }
  else {
    const { component_id } = params;
    id = component_id;
  }
  id = parseInt(id);

  console.log(params, id);
  const [testCaseListState, setTestCaseListState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();
  const contextValue = useContext(AuthContext);

  const fetchTestCaseListOfComponent = async () => {
    const serviceResponse = await fetchTestCaseListOfComponentService(id);
    console.log(serviceResponse.data);
    if (serviceResponse.status === 200) {
      setTestCaseListState(serviceResponse.data.payload);
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
  const fetchTestCaseListOfTester = async () => {
    const serviceResponse = await fetchTestCaseListOfTesterService(id);
    console.log(serviceResponse.data.payload);
    if (serviceResponse.status === 200) {
      setTestCaseListState(serviceResponse.data.payload);
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
    if (source === 'tester') {
      fetchTestCaseListOfTester();
    }
    else {
      fetchTestCaseListOfComponent();
    }
  }, []);


  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSnackbarClose = () => {
    setOpen(false);
  }


  const redirectToTestCaseForm = (tc_id) => {
    navigate(`/testCase/${tc_id}`, { replace: true, state: { c_id: id } });
  }

  // const redirectToAddTestCaseForm = () => {
  //   // return(<Navigate
  //   //   to={`/component/new`}
  //   //   replace={true}
  //   //   state={{ project_id: params.id }}
  //   // />)
  //   navigate("/testCase/new", { replace: true, state: { c_id: id } });
  // }

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
            {source === 'component' && contextValue.user.type === 'tester' &&(<Button
              style={{ marginBottom: "15px", marginTop: "15px" }}
              onClick={() => {redirectToTestCaseForm('new')}}
              variant={'contained'}
              color={'secondary'}
            >
              Add Test Case
            </Button>)
            }
            <div style={{ margin: 'auto', display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ bgcolor: '#e6ffe6', width: '80%' }} variant="outlined" >
                <CardHeader title="Test Cases" />

                <CardContent >
                  {showAlert ? (
                    <Alert variant="filled" severity="warning">
                      {alertMessage}
                    </Alert>
                  ) : (testCaseListState.map((e) => {
                    const { tc_id, tc_name, tc_desc, tc_status } = e;
                    return (
                      <div style={{ padding: '15px' }}>
                        <Accordion expanded={expanded === tc_id} onChange={handleChange(tc_id)}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                          >
                            <Typography sx={{ width: '10%', flexShrink: 0 }}>
                              {tc_name}
                            </Typography>
                            {/* <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography> */}
                          </AccordionSummary>
                          <AccordionDetails>
                            <Divider></Divider>
                            <div style={{ paddingTop: '25px' }}>
                              <Typography style={{ paddingBottom: '12px' }}>
                                {tc_desc}
                              </Typography>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <Stack direction="row" spacing={2}>
                                {contextValue.user.type === 'tester' && (<Button variant={'contained'} color={'secondary'} onClick={() => {redirectToTestCaseForm(tc_id)}}>Update the Test Case</Button>)}
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

export default TestCaseList;