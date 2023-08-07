import React from 'react'
import Base from './Base'
import { Box, Fab, Grid, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { URL, token } from "../App";
import axios from "axios";
import { useEffect } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import dayjs from 'dayjs';
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';
import SaveAsIcon from "@mui/icons-material/SaveAs";

const formatDate = (dateString) => {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
  return `${formattedDate} ${formattedTime}`;
};

const BatchEdit = () => {
    const { id } = useParams();
    const [batchData, setBatchData] = useState([]);
    const navigate = useNavigate();
    const defaultStartDate = dayjs(batchData?.startDate);
    const [startsDate, setStartsDate] = useState();

  // Fetch the data of the particular batch based on the id
  const fetchBatchData = async () => {
    try {
      const response = await axios.get(`${URL}/batch/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const formattedData = {
        ...response.data,
        createdAt: formatDate(response.data.createdAt),
        updatedAt: formatDate(response.data.updatedAt),
        startDate: dayjs(response.data.startDate).toDate(),
      };

      setBatchData(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBatchData();
  }, [id]);

   // Function to handle input changes for all the fields
   const handleInputChange = (e) => {
      setBatchData({ ...batchData, [e.target.name]: e.target.value });
  }; 

   // Function to handle the date selection
   const handleStartDate = (newValue) => {
    setStartsDate(newValue);
  };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
          const payload = {
            batch: batchData.batch,
            category: batchData.category,
            mentor: batchData.mentor,
          };

          if (startsDate) {
            const startDate = startsDate.format("YYYY-MM-DDTHH:mm:ss.SSS");
            payload.startDate = startDate;
          }

           const response = await axios.put(`${URL}/batch/update/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        navigate("/batch");
        toast.success(response.data.message);
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    }

    const handleDelete = async(event) => {
      try {
        const response = await axios.delete(`${URL}/students/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
  
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate('/student');
          window.location.reload();
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }

  return (
    <Base
    title={"Batch"} >

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
                    <TextField id="batch" required label="Batch" name='batch' value={batchData.batch} onChange={(e) => handleInputChange(e)} />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField id="category" required label="Category" name='category' value={batchData.category} onChange={(e) => handleInputChange(e)} />
                  </Grid>
                  </Grid>

                  <Grid container spacing={3} sx={{ mt: 1}}>
                  <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                    
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                              required
                              defaultValue={defaultStartDate}
                              sx={{ mt: 1, mr: 1 }}
                              onChange={handleStartDate}
                              label="Start Date & Time"
                              viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                              }}
                            />
                    </LocalizationProvider>
                  
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField id="mentor" required label="Mentor" name='mentor' value={batchData.mentor} onChange={(e) => handleInputChange(e)} />
                  </Grid>
                  </Grid>

                  <Grid item sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'center', m: 5 }}>
                  <Typography variant="button" display="block" gutterBottom>
                    Previous mentors: 
                  </Typography>
                  <Typography display="block" gutterBottom>
                  {batchData.prevMentors}
                  </Typography>

                  </Grid>
                  <Grid
                      item
                      xs={12}
                      md={6}
                      lg={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
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
                      Created By: {batchData.createdBy}
                    </Typography>
                    <br />
                    <Typography variant="button">
                      Created At: {batchData.createdAt}
                    </Typography><br/>
                    <Typography variant="button">
                      Updated By: {batchData.updatedBy}
                    </Typography>
                    <br />
                    <Typography variant="button">
                      Updated At: {batchData.updatedAt}
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

export default BatchEdit