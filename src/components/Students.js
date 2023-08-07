import React, { useEffect, useState } from 'react'
import Base from './Base'
import { useNavigate } from 'react-router-dom';
import { Autocomplete, Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Grid, Paper, TextField, Typography } from '@mui/material';
import { URL, token } from '../App';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';

const Students = () => {
    const navigate = useNavigate();
    const [ students, setStudents ] = useState();
  
    useEffect(() => {
        getStudents();
    }, []);
  
    // Get Students
    const getStudents = async () => {
      try {
        const res = await axios.get(`${URL}/students/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(res.data.students);
      } catch (error) {
        // toast.error(error.res.data.message);
      }
    };
  return (
    <Base
    title={"Students"}>
       <AddStudent  students={students} setStudents={setStudents} getStudents={getStudents} />
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={10} lg={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column", bgcolor: "#EEEEEE", }}>
              <div>
              {students && (
                <Grid container spacing={3}>
                  {students.map((student, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={`${student?._id}-${index}`}>
                      <Card sx={{ display: "flex", width: 200 }}>
                        
                        <CardActionArea
                          onClick={() =>
                            navigate(`/edit/student/${student?._id}`)
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
                                {student?.fullName}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                              >
                                {student?.batch}
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

export default Students

function AddStudent({ getStudents }) {
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [batch, setBatch] = useState('');
    const [batches, setBatches] = useState([]);
    
    useEffect(() => {
        getBatches();
      }, []);

      const getBatches = async () => {
        try {
          const res = await axios.get(`${URL}/batch/list`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setBatches(res.data.batches);
        } catch (error) {
          console.log(error);
        }
      };
  
    // Paper function
    const handleClickOpen = (scrollType) => () => {
      setOpen(true);
      setScroll(scrollType);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
  
    const handleAdd = async () => {
      try {
        const payload = {
          fullName: fullName,
          mobile: mobile,
          email: email,
          password: password,
          batch: batch.batch
        };
  
        const response = await axios.post(`${URL}/students/add`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          getStudents();
          setOpen(false);
        //   toast.success(response.data.message);
        } 
      } catch (error) {
        // toast.error(error.response.data.message);
      }
    };
  
    return (
      <div>
        <Fab variant="extended" sx={{ mb: 3, background: '#00ADB5', position: 'fixed', top: '5rem', right: '1rem', zIndex: 1000 }} onClick={handleClickOpen('paper')}>
          <AddIcon sx={{ mr: 1 }} />
          Add Student
        </Fab>
  
        <Dialog
          open={open}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Add Students</DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
              <div>
                <Box
                  component="form"
                  sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField id="fullName" required label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                  <TextField id="email" required label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}/>
                  <TextField id="mobile" required label="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)}/>
                  <TextField id="password" required label="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={batches}
                    getOptionLabel={(option) => option.batch}
                    sx={{ width: 300 }}
                    onChange={(e, value)=>setBatch(value)}
                    value={batches.batch}
                    isOptionEqualToValue={(option, value) => option.batch === value.batch}
                    renderInput={(params) => <TextField {...params} label="Select Batch" />}
                    />
                </Box>
              </div>
          </DialogContent>
          <DialogActions>
            <Button color="tang" onClick={handleClose}>
              Cancel
            </Button>
            <Button color="tang" onClick={handleAdd}>
              Add Lead
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }