import React, { useEffect, useState } from 'react'
import Base from './Base'
import { Box, Fab, Grid, Paper, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { URL, token } from "../App";
import axios from "axios";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';

const MentorsEdit = () => {
  const { id } = useParams();
  const [mentorData, setMentorData] = useState(); 
  const navigate = useNavigate();

  // Fetch the data of the particular student based on the id
  const fetchMentorData = async () => {
    try {
      const response = await axios.get(`${URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMentorData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMentorData();
  }, [id]);

   // Function to handle input changes for all the fields
   const handleInputChange = (e) => {
    setMentorData({ ...mentorData, [e.target.name]: e.target.value });
}; 

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
          const payload = {
            firstName: mentorData.firstName,
            lastName: mentorData.lastName,
            status: mentorData.status,
            email: mentorData.email
          };

          const response = await axios.put(`${URL}/users/update/${id}`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.status === 200) {
            navigate("/mentors");
            toast.success(response.data.message);
            window.location.reload();
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
    }

    const handleDelete = async(event) => {
      try {
        const response = await axios.delete(`${URL}/users/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
  
        if (response.status === 201) {
          // toast.success(response.data.message);
          navigate('/student');
          window.location.reload();
        }
      } catch (error) {
        // toast.error(error.response.data.message);
      }
    }


  return (
    <Base
    title={"Mentors"} >

      <Fab variant="extended" 
      sx={{ mb: 3, background: "#f44336", position: "fixed", top: "5rem", right: "2rem", zIndex: 1000 }}
       onClick={handleDelete} >
        <DeleteForeverIcon sx={{ mr: 1 }} />
        Delete
      </Fab>

        <Box
          component="form"
          noValidate
          onSubmit={handleUpdate}
          encType="multipart/form-data"
          sx={{ mt: 1 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column", bgcolor: "#EEEEEE" }}>

              <Grid container spacing={3} sx={{ mt: 1}}>
                  <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField id="firstName" required label="First Name" name='firstName' value={mentorData?.firstName} onChange={(e) => handleInputChange(e)} />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField id="lastName" required label="Last Name" name='lastName' value={mentorData?.lastName} onChange={(e) => handleInputChange(e)} />
                  </Grid>
                  </Grid>

                  <Grid container spacing={3} sx={{ mt: 1}}>
                  <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField id="status" required label="Status" name='status' value={mentorData?.status} onChange={(e) => handleInputChange(e)} />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField id="email" required label="E-mail" name='email' value={mentorData?.email} onChange={(e) => handleInputChange(e)} />
                  </Grid>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Fab
                            variant="extended"
                            onClick={handleUpdate}
                            color="orange"
                            sx={{ ml: 3, mt: 4 }}
                          >
                            <SaveAsIcon sx={{ mr: 1 }} />
                            Update
                          </Fab>
                          </Grid>

              <Grid container spacing={3} sx={{mt: 7}}>
                  <Grid item sm={12} md={6} lg={6} sx={{ ml: 3 }}>
                    <Typography variant="button">
                      Created By: {mentorData?.createdBy}
                    </Typography>
                    <br />
                    <Typography variant="button">
                      Created At: {mentorData?.createdAt}
                    </Typography><br/>
                    <Typography variant="button">
                      Updated By: {mentorData?.updatedBy}
                    </Typography>
                    <br />
                    <Typography variant="button">
                      Updated At: {mentorData?.updatedAt}
                    </Typography>
                  </Grid></Grid>

              </Paper>
            </Grid>
          </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>

    </Base>
  )
}

export default MentorsEdit