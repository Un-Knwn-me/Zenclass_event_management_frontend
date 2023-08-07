import React, { useState } from 'react'
import Base from './Base'
import { Box, Card, CardActionArea, CardContent, Grid, Paper, TextField, Typography } from '@mui/material'
import { LocalizationProvider, StaticDateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom'
import { URL, token } from '../App'
import axios from 'axios';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [events, setEvents] = useState();
  const navigate = useNavigate();

    // Function to handle the date selection
    const handleDateChange = (newValue) => {
      setSelectedDate(newValue); 
    };
  
  
  const handleDateAccept = async() => {
    try {
      const date = selectedDate.format('YYYY-MM-DDTHH:mm:ss.SSS'); 
    
    const res = await axios.get(`${URL}/events/bydate/${date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const formattedEvents = res.data.events.map(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const StartTime = startDate.toLocaleString();
      const EndTime = endDate.toLocaleString();
      return {
        ...event,
        StartTime: StartTime,
        EndTime: EndTime
      };
    });
      setEvents(formattedEvents);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Base
    title={'Dashboard'}
    >
    <Grid container spacing={3}>
    <Grid item xs={12} md={12} lg={12} sx={{mb: 5}}>
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", bgcolor: "#EEEEEE" }}>
    <Typography variant='h4' align='center'>Get Event Details</Typography><br/>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={7} lg={7} >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDateTimePicker 
              label="Select Date and Time"
              value={selectedDate}
              onChange={handleDateChange}
              onAccept={handleDateAccept}
              TextField={(params) => <TextField {...params}/>} 
            />                        
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={12} md={5} lg={5} >
          <Typography variant='h5' align='center'>Events</Typography><br/>
          <Paper style={{ height: 420, overflow: 'auto' }}>
            {events && events.length > 0 ? (
              <Grid container spacing={1}>
                {events.map((event, index) => ( 
                  <Grid item key={`${event?._id}-${index}`} xs={12} md={12} lg={12}>
                    <Card sx={{ display: "flex", bgcolor: "#393E46", m: 1}}>
                      <CardActionArea
                        onClick={() =>
                          navigate(`/edit/events/${event?._id}`)
                        }
                      >
                        <Box
                          sx={{ display: "flex", flexDirection: "column" }}
                        >
                          <CardContent sx={{ flex: "1 0 auto" }}>
                            <Typography
                              component="div"
                              variant="h6"
                              color="#00ADB5"
                              align='center'
                            >
                              {event?.title}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              color='#EEEEEE'
                              align='center'
                              sx={{ml:1, mr:1}}
                            > 
                              {event?.StartTime} to {event?.EndTime}
                            </Typography>
                          </CardContent>
                        </Box>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant='h6' align='center' style={{ padding: 16, color: "#B2B1B9" }}>No Events</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  </Grid>
    </Grid>
    </Base>
  )
}

export default Dashboard