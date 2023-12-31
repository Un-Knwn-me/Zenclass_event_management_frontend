import React from "react";
import Base from "./Base";
import { Autocomplete, Box, Fab, Grid, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { URL, token } from "../App";
import axios from "axios";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { toast } from "react-toastify";

const StudentsEdit = () => {
  const { id } = useParams();
  const [studentsData, setStudentsData] = useState();
  const [batches, setBatches] = useState([]);
  const [batch, setBatch] = useState('');
  const navigate = useNavigate();

  // Fetch the data of the particular student based on the id
  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`${URL}/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudentsData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getBatch = async () => {
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

  useEffect(() => {
    fetchStudentData();
    getBatch();
  }, [id]);

  // Function to handle input changes for all the fields
  const handleInputChange = (e) => {
    setStudentsData({ ...studentsData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        fullName: studentsData.fullName,
        mobile: studentsData.mobile,
        email: studentsData.email,
      };
      if(batch){
        payload.batch= batch.batch;
      }

      const response = await axios.put(
        `${URL}/students/update/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate("/student");
        toast.success(response.data.message);
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async (event) => {
    try {
      const response = await axios.delete(`${URL}/students/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/student");
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Base title={"Students"}>
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
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        lg={6}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <TextField
                          id="fullName"
                          required
                          label="Full Name"
                          name="fullName"
                          value={studentsData?.fullName}
                          onChange={(e) => handleInputChange(e)}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        lg={6}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <TextField
                          id="email"
                          required
                          label="E-mail"
                          name="email"
                          value={studentsData?.email}
                          onChange={(e) => handleInputChange(e)}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        lg={6}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <TextField
                          id="mobile"
                          required
                          label="Mobile"
                          name="mobile"
                          value={studentsData?.mobile}
                          onChange={(e) => handleInputChange(e)}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        lg={6}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <TextField
                          id="batch"
                          required
                          label="Batch"
                          name="batch"
                          value={studentsData?.batch}
                          onChange={(e) => handleInputChange(e)}
                        />
                      </Grid>
                    </Grid>

                    <br/>
<hr/><br/>
<Grid item sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'center'}}>
                          <Typography variant="button" sx={{ mt: 2 }}> Change the batch:</Typography>
                          </Grid>
<br/>
<Grid item sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'center'}}>
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

                    <Grid container spacing={3} sx={{ mt: 7 }}>
                      <Grid item sm={12} md={6} lg={6} sx={{ ml: 3 }}>
                        <Typography variant="button">
                          Created By: {studentsData?.createdBy}
                        </Typography>
                        <br />
                        <Typography variant="button">
                          Created At: {studentsData?.createdAt}
                        </Typography>
                        <br />
                        <Typography variant="button">
                          Updated By: {studentsData?.updatedBy}
                        </Typography>
                        <br />
                        <Typography variant="button">
                          Updated At: {studentsData?.updatedAt}
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

export default StudentsEdit;
