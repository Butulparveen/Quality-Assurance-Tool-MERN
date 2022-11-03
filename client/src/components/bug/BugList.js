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
import { fetchBugListOfDeveloperService } from '../../services/bugService';

const styles = {
  paperContainer: {
      backgroundImage: `url(${Image})`,

    height: "100vh"
  }
};


const BugList = (props) => {
  let id;
  const { source } = props;
  const params = useParams();
  if (source === 'tester') {
    const { tester_id } = params;
    id = tester_id;

  }
  else {
    const { developer_id } = params;
    id = developer_id;
  }
  id = parseInt(id);

  const [bugListState, setBugListState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();
  const contextValue = useContext(AuthContext);

  const fetchBugListOfDeveloper = async () => {
    const serviceResponse = await fetchBugListOfDeveloperService(id);
    if (serviceResponse.status === 200) {
      setBugListState(serviceResponse.data.payload);
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


  useEffect(() => {

    if(source === 'developer') {
      fetchBugListOfDeveloper();
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
            <div style={{ margin: 'auto', display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ bgcolor: '#e6ffe6', width: '80%' }} variant="outlined" >
                <CardHeader title="Bugs" />

                <CardContent >
                  {showAlert ? (
                    <Alert variant="filled" severity="warning">
                      {alertMessage}
                    </Alert>
                  ) : (bugListState.map((e) => {
                    const { b_id, firstName, tc_name } = e;
                    return (
                      <div style={{ padding: '15px' }}>
                        <Accordion expanded={expanded === b_id} onChange={handleChange(b_id)}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                          >
                            <Typography sx={{ width: '30%', flexShrink: 0 }}>
                              Test case: {tc_name}
                            </Typography>
                            <Typography sx={{ width: '50%', color: 'text.secondary' }}>{firstName}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Divider></Divider>
                            {/* <div style={{ paddingTop: '25px' }}>
                              <Typography style={{ paddingBottom: '12px' }}>
                                {tc_desc}
                              </Typography>
                            </div> */}
                            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '15px' }}>
                              <Stack direction="row" spacing={2}>
                                <Button variant={'contained'} color={'secondary'} >Mark As Resolved</Button>

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

export default BugList;