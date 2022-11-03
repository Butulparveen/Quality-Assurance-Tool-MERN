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
import { AuthContext } from './authentication/ProvideAuth';

const Dashboard = () => {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const contextValue = useContext(AuthContext);

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
            {
              contextValue.user.type === 'manager' && (
                  <Stack spacing={2}>
                    <Button >Go to Project List</Button>
                  </Stack>
              )
            }
            {
              contextValue.user.type === 'testlead' && (
                  <Stack spacing={2}>
                    <Button >Go to Components List</Button>
                  </Stack>
              )
            }
            {
              contextValue.user.type === 'tester' && (
                  <Stack spacing={2}>
                    <Button >Go to Test cases List</Button>
                  </Stack>
              )
            }
          </>


        )

      }
    </>
  )
}

export default Dashboard;

