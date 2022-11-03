//SJSU CMPE 138 Spring 2022 TEAM3 

import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAnalysisTestCase = () => {
  const navigate = useNavigate();

  return(
      <React.Fragment>
      <div>
      <div style={{position: "relative", height: "560px", width: "100%"}}>
          <iframe 
          title="Analysis"
          frame-ancestors={'self'}
          style={{width:"100%", height:"100%", border:"0", frameborder: "0" }}
              src="https://datastudio.google.com/embed/reporting/772e87f6-8b00-4e0c-91bd-726cd74c9882/page/p_2t5ko40guc"  
              allowfullscreen>
          </iframe>
      </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', paddingTop: '15px'}}>
          <Button variant={'contained'} onClick = {() => {navigate(-1)}}>Go Back</Button>
      </div>
      </React.Fragment>
  )
}

export default AdminAnalysisTestCase;