import React, { useEffect, useState } from 'react'
import Base from './Base'
import { URL, token } from '../App';
import axios from 'axios';
import { Box, Card, CardActionArea, CardContent, Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Mentors = () => {
  const navigate = useNavigate();
  const [ mentors, setMentors ] = useState();
  
    useEffect(() => {
        getMentors();
    }, []);
  
    // Get Mentors
    const getMentors = async () => {
      try {
        const res = await axios.get(`${URL}/users/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMentors(res.data.users);
      } catch (error) {
        // toast.error(error.res.data.message);
      }
    };
    
  return (
    <Base
    title={"Mentors"}>
       {/* <AddMentor  mentors={mentors} getMentors={getMentors} setMentors={setMentors} /> */}
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={10} lg={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column", bgcolor: "#EEEEEE", }}>
              <div>
              {mentors && (
                <Grid container spacing={3}>
                  {mentors.map((mentor, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={`${mentor?._id}-${index}`}>
                      <Card sx={{ display: "flex", width: 200 }}>
                        
                        <CardActionArea
                          onClick={() =>
                            navigate(`/edit/mentor/${mentor?._id}`)
                          }
                        >
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <CardContent sx={{ flex: "1 0 auto" }}>
                              <Typography
                                component="div"
                                variant="h6"
                                color="#222831"
                              >
                                {mentor?.firstName} {mentor?.lastName}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                              >
                                {mentor?.status}
                              </Typography>
                            </CardContent>
                            {/* <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                pl: 1,
                                pb: 1,
                              }}
                            >
                              {student.mentor}
                            </Box> */}
                          </Box>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div> 
    </Base>
  )
}

export default Mentors

