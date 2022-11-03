//SJSU CMPE 138 Spring 2022 TEAM3 

import React, { useContext, useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import { getTotalComponentCountService } from '../services/componentService';
import { getTotalProjectCountService } from '../services/projectService';
import Alert from '@mui/material/Alert';
import { getTotalTestCaseCountService } from '../services/testCaseService';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Image from '../../src/img.jpg'; // Import using relative path
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './authentication/ProvideAuth';


const styles = {
  paperContainer: {
      backgroundImage: `url(${Image})`,

    height: "100vh"
  }
};


const Dashboard = () => {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const contextValue = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchTotalProjectsCount = async () => {
    const serviceResponse1 = await getTotalProjectCountService();
    const serviceResponse2 = await getTotalComponentCountService();
    const serviceResponse3 = await getTotalTestCaseCountService();
    let projects, components, testCases;
    if (serviceResponse1.status === 200) {
      projects = serviceResponse1.data.payload[0]['COUNT'];
    }
    if (serviceResponse2.status === 200) {
      components = serviceResponse2.data.payload[0]['COUNT'];
    }
    if (serviceResponse3.status === 200) {
      testCases = serviceResponse3.data.payload[0]['COUNT'];
    }
    if (serviceResponse1.status !== 200 || serviceResponse3.status !== 200 || serviceResponse2.status !== 200) {
      setOpen(true);
      setMessage("Some Error Occured");
    }
    else {
      setStatistics({
        ...statistics,
        projects,
        components,
        testCases,
      })
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTotalProjectsCount();
  }, [])

  const handleClose = () => {
    setOpen(false);
  }
  return (
    <>
    <Paper style={styles.paperContainer}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
      />
      {loading ?
        (<CircularProgress color="success" />)
        :
        (
          <>
            <Alert icon={false} severity="info" style={{ justifyContent: 'center' }}>
            <h1 style={{color: '#0a75ad'}}>Welcome to Spartan QA Tool</h1>
            </Alert>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '15px' }}>
              <Stack direction="row" spacing={2}>

                <Box component="span" sx={{ bgcolor: '#8C92AC', p: 6, border: '1px groove grey', borderRadius: '10px' }}>
                  <h3>Projects Taken by the Company</h3>
                  <h2>{statistics.projects}</h2>
                </Box>
                <Box component="span" sx={{ bgcolor: '#8C92AC', p: 6, border: '1px groove grey', borderRadius: '10px' }}>
                  <h3>Test Ready Component</h3>
                  <h2>{statistics.components}</h2>
                </Box>
                <Box component="span" sx={{ bgcolor: '#8C92AC', p: 6, border: '1px groove grey', borderRadius: '10px' }}>
                  <h3>Test Cases Generated</h3>
                  <h2>{statistics.testCases}</h2>
                </Box>
              </Stack>
            </div>

            <div style={{display: 'flex', justifyContent: 'center', padding:'15px'}}>
              <h1 style={{color: '#0a75ad'}}>People Using this System</h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
              <Stack direction="row" spacing={2}>

                <Box component="span" sx={{ bgcolor: '#c1c4d2', p: 6, border: '1px groove grey', borderRadius: '10px' }}>
                  <h3>Managers</h3>
                  <h2>{statistics.projects}</h2>
                </Box>
                <Box component="span" sx={{ bgcolor: '#c1c4d2', p: 6, border: '1px groove grey', borderRadius: '10px' }}>
                  <h3>Test Leads</h3>
                  <h2>{statistics.components}</h2>
                </Box>
                <Box component="span" sx={{ bgcolor: '#c1c4d2', p: 6, border: '1px groove grey', borderRadius: '10px' }}>
                  <h3>Testers</h3>
                  <h2>{statistics.projects}</h2>
                </Box>
                <Box component="span" sx={{ bgcolor: '#c1c4d2', p: 6, border: '1px groove grey', borderRadius: '10px' }}>
                  <h3>Developer</h3>
                  <h2>{statistics.components}</h2>
                </Box>

              </Stack>
            </div>
            {contextValue.isAuthenticated && (<div style={{display: 'flex', justifyContent: 'center'}}>
              {contextValue.user.type === 'manager' ?
                (
                  <Stack direction="row" spacing={2}>
                    <Button
                    style={{marginTop: '15px',  backgroundColor: "#21b6ae"}}
                      variant={'contained'}
                      onClick={() => navigate(`/project_list/manager/${contextValue.user.e_id}`)}>
                      Go to Your Projects
                    </Button>
                    <Button
                    style={{marginTop: '15px',  backgroundColor: "#21b6ae"}}
                      variant={'contained'}
                      onClick={() => navigate(`/admin/project/`)}>
                      Go to Data Project Analysis
                    </Button>
                    <Button
                    style={{marginTop: '15px',  backgroundColor: "#21b6ae"}}
                      variant={'contained'}
                      onClick={() => navigate(`/admin/testCase/`)}>
                      Go to Data Test Case Analysis
                    </Button>
                  </Stack>
                ) :
                (contextValue.user.type === 'developer' ? (
                  <Button
                  style={{marginTop: '15px',  backgroundColor: "#21b6ae"}}
                  variant={'contained'}
                  onClick={() => navigate(`/bug_list/developer/${contextValue.user.e_id}`)}>
                  Bug List
                </Button>
                ) :
                (<Button
                  style={{marginTop: '15px',  backgroundColor: "#21b6ae"}}
                  variant={'contained'}
                  onClick={() => navigate(`/project_list/manager/all`)}>
                  Project List
                </Button>))
              }
            </div>)}
          </>


        )

      }
      </Paper>
    </>
  )
}

export default Dashboard;

