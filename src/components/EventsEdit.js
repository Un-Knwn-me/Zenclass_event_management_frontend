import React, { useEffect, useState } from "react";
import Base from "./Base";
import { Autocomplete, Box, Fab, Grid, Paper, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { URL, token } from "../App";
import axios from "axios";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import dayjs from "dayjs";
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";

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

const EventsEdit = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState({ students: [] });
  const [batchData, setBatchData] = useState([]);
  const [batch, setBatch] = useState(eventData?.batch);
  const navigate = useNavigate();
  const defaultStartDate = dayjs(eventData?.startDate);
  const defaultEndDate = dayjs(eventData?.endDate);
  const [startsDate, setStartsDate] = useState();
  const [endsDate, setEndsDate] = useState();

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

  // Fetch the data of the particular event based on the id
  const fetchEventData = async () => {
    try {
      const response = await axios.get(`${URL}/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const formattedData = {
        ...response.data,
        createdAt: formatDate(response.data.createdAt),
        updatedAt: formatDate(response.data.updatedAt),
        startDate: dayjs(response.data.startDate).toDate(),
        endDate: dayjs(response.data.endDate),
      };

      setEventData(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEventData();
    getBatch();
  }, [id]);

  // Function to handle input changes for all the fields
  const handleInputChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // Function to handle the date selection
  const handleStartDate = (newValue) => {
    setStartsDate(newValue);
  };

  const handleEndDate = (newValue) => {
    setEndsDate(newValue);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        title: eventData.title,
        category: eventData.category,
        venue: eventData.venue,
        hostedBy: eventData.hostedBy,
        description: eventData.description,
      };

      if (batch) {
        payload.batch = batch.batch;
        payload.batchId = batch._id;
        payload.students = batch.students;
      }

      if (startsDate) {
        const startDate = startsDate.format("YYYY-MM-DDTHH:mm:ss.SSS");
        payload.startDate = startDate;
      }

      if (endsDate) {
        const endDate = endsDate.format("YYYY-MM-DDTHH:mm:ss.SSS");
        payload.endDate = endDate;
      }

      const response = await axios.put(`${URL}/events/update/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        navigate("/event");
        toast.success(response.data.message);
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async (event) => {
    try {
      const response = await axios.delete(`${URL}/events/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/leads");
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Base title={"Events"}>
      <Fab
        variant="extended"
        sx={{
          mb: 3,
          background: "#f44336",
          position: "fixed",
          top: "5rem",
          right: "2rem",
          zIndex: 1000,
        }}
        onClick={handleDelete}
      >
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
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: "#EEEEEE",
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item sm={12} md={12} lg={12}>
                        <Typography variant="h4" align="center">
                          Event Details
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        sm={12}
                        md={12}
                        lg={12}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Box
                          sx={{
                            width: 510,
                            maxWidth: "100%",
                          }}
                        >
                          <TextField
                            fullWidth
                            required
                            label="Tittle"
                            id="title"
                            name="title"
                            margin="dense"
                            value={eventData.title}
                            onChange={(e) => handleInputChange(e)}
                          />
                          <TextField
                            fullWidth
                            required
                            label="Category"
                            id="category"
                            name="category"
                            margin="dense"
                            value={eventData.category}
                            onChange={(e) => handleInputChange(e)}
                          />
                          <TextField
                            fullWidth
                            required
                            label="Venue"
                            id="venue"
                            name="venue"
                            margin="dense"
                            value={eventData.venue}
                            onChange={(e) => handleInputChange(e)}
                          />

                          <Grid
                            item
                            sm={12}
                            md={12}
                            lg={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: 2,
                            }}
                          >
                            <Typography>Batch:- </Typography>
                            <Typography variant="button">
                              {" "}
                              {eventData?.batch}
                            </Typography>
                          </Grid>

                          <Autocomplete
                            fullWidth
                            required
                            disablePortal
                            id="combo-box-demo"
                            options={batchData}
                            getOptionLabel={(option) => option.batch}
                            sx={{ width: 300, mt: 1 }}
                            onChange={(e, value) => setBatch(value)}
                            value={batchData._id}
                            defaultValue={eventData.batchId}
                            isOptionEqualToValue={(option, value) =>
                              option._id === value._id
                            }
                            renderInput={(params) => (
                              <TextField {...params} label="Select New Batch" />
                            )}
                          />

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

                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                              required
                              defaultValue={defaultEndDate}
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

                          <TextField
                            fullWidth
                            required
                            label="Hosted By"
                            id="hostedBy"
                            name="hostedBy"
                            margin="dense"
                            value={eventData.hostedBy}
                            onChange={(e) => handleInputChange(e)}
                          />

                          <TextField
                            fullWidth
                            required
                            id="description"
                            label="Description"
                            name="description"
                            multiline
                            margin="dense"
                            rows={4}
                            value={eventData.description}
                            onChange={(e) => handleInputChange(e)}
                          />

                          <Typography variant="button" sx={{ mt: 2 }}>
                            {" "}
                            Students for this event:-{" "}
                          </Typography>
                          <Typography>
                            {" "}
                            {eventData.students.join(", ")}
                          </Typography>

                          <Fab
                            variant="extended"
                            onClick={handleUpdate}
                            color="orange"
                            sx={{ ml: 3, mt: 4 }}
                          >
                            <SaveAsIcon sx={{ mr: 1 }} />
                            Update
                          </Fab>
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container spacing={3} sx={{ mt: 7 }}>
                      <Grid item sm={12} md={6} lg={6} sx={{ ml: 3 }}>
                        <Typography variant="button">
                          Created By: {eventData.createdBy}
                        </Typography>
                        <br />
                        <Typography variant="button">
                          Created At: {eventData.createdAt}
                        </Typography>
                        <br />
                        <Typography variant="button">
                          Updated By: {eventData.updatedBy}
                        </Typography>
                        <br />
                        <Typography variant="button">
                          Updated At: {eventData.updatedAt}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Base>
  );
};

export default EventsEdit;
