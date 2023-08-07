import React, { useEffect, useState } from 'react'
import Base from './Base'
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Grid, Paper, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { URL, token } from '../App';
import axios from 'axios';
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


const Batch = () => {
  const navigate = useNavigate();
  const [ batches, setBatches ] = useState();

  useEffect(() => {
      getBatches();
  }, []);

  // Get Batches
  const getBatches = async () => {
    try {
      const res = await axios.get(`${URL}/batch/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBatches(res.data.batches);
    } catch (error) {
      // toast.error(error.res.data.message);
    }
  };

  return (
    <Base title={"Batch"}>
      <AddBatch  batches={batches} getBatches={getBatches} setBatches={setBatches} />
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12} md={10} lg={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column", bgcolor: "#EEEEEE", }}>
              <div>
              {batches && (
                <Grid container spacing={3}>
                  {batches.map((batch) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={batch?._id}>
                      <Card
                         key={batch?._id}
                        sx={{ display: "flex", width: 200 }}
                      >
                        
                        <CardActionArea
                          onClick={() =>
                            navigate(`/edit/batch/${batch?._id}`)
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
                                {batch?.batch}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                              >
                                {batch?.category}
                              </Typography>
                            </CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                pl: 1,
                                pb: 1,
                              }}
                            >
                              {batch.mentor}
                            </Box>
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
  );
};

export default Batch


// Add Batch

function AddBatch({ getBatches }) {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState('paper');
  const [batch, setBatch] = useState("");
  const [startsDate] = useState('');
  const [category, setCategory] = useState("");
  const [mentor, setMentor] = useState("");

    // Paper function
    const handleClickOpen = (scrollType) => () => {
      setOpen(true);
      setScroll(scrollType);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    
  const handleAdd = async (event) => {
    event.preventDefault();
    try {
      const startDate = startsDate.format('YYYY-MM-DDTHH:mm:ss.SSS');

      const payload = {
        batch: batch,
        category: category,
        mentor: mentor,
        startDate: startDate
      };
      console.log(payload)

      const response = await axios.post(`${URL}/batch/add`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        getBatches();
        setOpen(false);
        // toast.success(response.data.message);
      } 
    } catch (error) {
      // toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <Fab variant="extended" sx={{ mb: 3, background: '#00ADB5', position: 'fixed', top: '5rem', right: '1rem', zIndex: 1000 }} onClick={handleClickOpen('paper')}>
        <AddIcon sx={{ mr: 1 }} />
        Add Batch
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Add Batch</DialogTitle>
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
              <TextField id="batch" required label="Batch Id" value={batch} onChange={(e) => setBatch(e.target.value)} />
              <TextField id="category" required label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
              <TextField id="mentor" required label="Mentor" value={mentor} onChange={(e) => setMentor(e.target.value)} />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="With Time Clock"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
        />
    </LocalizationProvider>

            </Box>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="tang" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="tang" onClick={handleAdd}>
            Add Batch
          </Button>
        </DialogActions>
      </Dialog>
    </div>  
);
}