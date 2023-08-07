import React, { forwardRef, useEffect, useState } from 'react'
import Base from './Base'
import { AppBar, Autocomplete, Box, Button, Dialog, Fab, Grid, IconButton, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Toolbar, Typography } from '@mui/material'
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { URL, token } from '../App'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from "@mui/icons-material/Close";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
  { id: 'startDate', label: 'Start Date', minWidth: 100 },
  { id: 'title', label: 'Title', minWidth: 100 },
  { id: 'category', label: 'Category', minWidth: 100, align: 'right' },
  { id: 'venue', label: 'Venue', minWidth: 100, align: 'right' },
  { id: 'batch', label: 'Batch', minWidth: 100, align: 'right' },
  { id: 'startTime', label: 'Start Time', minWidth: 100, align: 'right' },
  { id: 'hostedBy', label: 'Hosted By', minWidth: 100, align: 'right' },
];

const Events = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // Table and pages
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getevents();
}, []);

// Get Events
const getevents = async () => {
  try {
    const res = await axios.get(`${URL}/events/all-events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const eventsData = res.data.events;
    const transformedRows = eventsData.map((eventData) =>
      createData(
        eventData.startDate,
        eventData.title,
        eventData.category,
        eventData.venue,
        eventData.batch,
        eventData.startTime,
        eventData.hostedBy,
        eventData._id
      )
    );

    setRows(transformedRows);
  } catch (error) {
    console.log(error);
  }
};


  // table
  const createData = (
    startDate,
    title,
    category,
    venue,
    batch,
    startTime,
    hostedBy,
    _id,
  ) => {
    const date = new Date(startDate);
  
    const formattedDate = date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  
    return {
      startDate: formattedDate,
      title,
      category,
      venue,
      batch,
      startTime: formattedTime,
      hostedBy,
      _id,
    };
  };

  return (
    <Base
    title={"Events"}>
      <div>
        <AddEvent getevents={getevents} />
        </div>
        <Grid container spacing={3}>
  

  <Grid item xs={12} md={12} lg={12}>
    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", bgcolor: "#EEEEEE" }}>
    <Typography variant='h4' align='center'>All Events</Typography><br/>
<div className='eventlist'>

<Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id} onClick={()=> navigate(`/edit/events/${row._id}`)} > 
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>

</div>

</Paper></Grid>
</Grid>
    </Base>
  )
}

export default Events

// Add Event

function AddEvent({getevents}) {
  const now = dayjs();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [startsDate, setStartsDate] = useState(dayjs());
  const [endsDate, setEndsDate] = useState(dayjs());
  const [batch, setBatch] = useState("");
  const [venue, setVenue] = useState("");
  const [hostedBy, setHostedBy] = useState("");
  const [description, setDescription] = useState("");
  const [batchData, setBatchData] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

   // Function to handle the date selection
   const handleStartDate = (newValue) => {
    setStartsDate(newValue); 
  };

  const handleEndDate = (newValue) => {
    setEndsDate(newValue); 
  };

  useEffect(() => {
    getBatch();
  }, []);

  const getBatch = async () => {
    try {
      const res = await axios.get(`${URL}/batch/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBatchData(res.data.batches);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    try {
      const startDate = startsDate.format('YYYY-MM-DDTHH:mm:ss.SSS');
      const endDate = endsDate.format('YYYY-MM-DDTHH:mm:ss.SSS');
      
      const payload = {
        title: title,
        category: category,
        startDate: startDate,
        endDate: endDate,
        batch: batch.batch,
        batchId:batch._id,
        students: batch.students,
        venue: venue,
        hostedBy: hostedBy,
        description: description,
      };

      console.log(payload)

      const response = await axios.post(`${URL}/events/add`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setOpen(false);
        // toast.success(response.data.message);
        getevents();
      }
    } catch (error) {
      // toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <Fab variant="extended" 
      sx={{ mb: 3, background: '#00ADB5', position: "fixed", top: "5rem", right: "1rem", zIndex: 1000 }}
       onClick={handleClickOpen} >
        <AddIcon sx={{ mr: 1 }} />
        Add Event
      </Fab>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", background: "#222831" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add Event
            </Typography>
            <Button autoFocus color="inherit" onClick={handleAdd}>
              Save
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          component="form"
          noValidate
          onSubmit={handleAdd}
          encType="multipart/form-data"
          sx={{ mt: 1 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>

              <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column", bgcolor: "#EEEEEE" }}>

                <Grid container spacing={3}>
                  <Grid item sm={12} md={12} lg={12}>
                    <Typography variant='h4' align='center'>Assign a new event</Typography>
                  </Grid>
                  <Grid item sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box
                      sx={{
                      width: 510,
                      maxWidth: '100%',
                      }}
                    >
                      <TextField fullWidth required label="Tittle" id="title" name='title' margin="dense" value={title} onChange={(e) => setTitle(e.target.value)} />
                      <TextField fullWidth required margin='dense' id="category" label="Category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                      <TextField fullWidth required margin='dense' id="venue" label="Venue" name='venue'  value={venue} onChange={(e) => setVenue(e.target.value)}/>

                      <Autocomplete
                        fullWidth 
                        required
                        disablePortal
                        id="combo-box-demo"
                        options={batchData}
                        getOptionLabel={(option) => option.batch}
                        sx={{ width: 300, mt: 1 }}
                        onChange={(e, value)=>setBatch(value)}
                        value={batchData._id}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        renderInput={(params) => <TextField {...params} label="Batch" />}
                      />
                  
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            required
                            defaultValue={now}
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

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            required
                            onChange={handleEndDate}
                            label="End Date & Time"
                            sx={{ mt: 1 }}
                            viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                            }}
                          />
                      </LocalizationProvider>
                      
                      <TextField fullWidth required margin='dense' id="hostedBy" label="Hosted By" name='hostedBy' value={hostedBy} onChange={(e) => setHostedBy(e.target.value)} />

                      <TextField
                        fullWidth 
                        required
                        id="description"
                        label="Description"
                        multiline
                        margin='dense'
                        rows={4}
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                      />

                  </Box>
                  </Grid>

                </Grid>
                

              </Paper>
            </Grid>
          </Grid>

              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </div>
  );
}