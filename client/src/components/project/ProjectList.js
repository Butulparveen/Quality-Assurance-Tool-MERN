//SJSU CMPE 138 Spring 2022 TEAM3 

import React, { useEffect, useState, useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useParams } from 'react-router-dom';
import { fetchProjectListOfManagerService } from '../../services/projectService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardHeader, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../authentication/ProvideAuth';
import Image from '../../../src/img.jpg'; // Import using relative path
import { Paper } from '@mui/material';

const styles = {
  paperContainer: {
      backgroundImage: `url(${Image})`,

    height: "100vh"
  }
};

const ProjectList = () => {
  const { manager_id } = useParams();
  const [projectListState, setProjectListState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const contextValue = useContext(AuthContext);
  const fetchProjectListOfManager = async () => {
    const serviceResponse = await fetchProjectListOfManagerService(manager_id);
    if (serviceResponse.status === 200) {
      setProjectListState(serviceResponse.data.payload);
      setLoading(false);
    }
    else {
      setOpen(true);
      setMessage('Some error occured while fetching data');
    }
  }



  useEffect(() => {
    fetchProjectListOfManager();
  }, []);


  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSnackbarClose = () => {
    setOpen(false);
  }

  const redirectToComponents = (project_id) => {
    navigate(`/component_list/project/${project_id}`)
  }

  const redirectToProjectForm = (p_id) => {
    navigate(`/project/${p_id}`);
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
            {contextValue.user.type === 'manager'&& (<Button
              style={{ marginBottom: "15px",  marginTop: "15px"  }}
              onClick={() => redirectToProjectForm('new')}
              variant={'contained'}
              color={'secondary'}
            >
              Add Project
            </Button>)
            }
          <div style={{ margin: 'auto', display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ bgcolor: '#e6ffe6', width: '80%' }} variant="outlined" >
              <CardHeader title="Projects" />

              <CardContent >
                {projectListState.map((e) => {
                  const { p_id, p_name, p_desc, TestReady: testReady, Completed: completed } = e;
                  return (
                    <div style={{ padding: '15px' }}>
                      <Accordion expanded={expanded === p_id} onChange={handleChange(p_id)}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography sx={{ width: '10%', flexShrink: 0 }}>
                            {p_name}
                          </Typography>
                          {/* <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography> */}
                        </AccordionSummary>
                        <AccordionDetails>
                          <Divider></Divider>
                          <div style={{paddingTop: '25px'}}>
                            <Typography style={{paddingBottom: '12px'}}>
                              {p_desc}
                            </Typography>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Stack direction="row" spacing={2}>
                              <Typography style={{paddingBottom: '12px'}}>
                                <strong>Test Ready</strong>: {testReady}
                              </Typography>
                              <Typography style={{paddingBottom: '12px'}}>
                                <strong>Completed</strong>: {completed}
                              </Typography>
                            </Stack>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <Stack direction="row" spacing={2}>
                                {contextValue.user.type === 'manager' && (<Button variant={'contained'} color={'secondary'} onClick={() => {redirectToProjectForm(p_id)}}>Update Project</Button>)}
                                <Button onClick={() => {redirectToComponents(p_id)}} variant={'contained'}>Components</Button>
                              </Stack>

                            </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  )
                })}
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

export default ProjectList;