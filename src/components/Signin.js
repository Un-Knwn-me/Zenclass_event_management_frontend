import React, { useState } from 'react'
import { AppBar, Avatar, Box, Button, Checkbox, CssBaseline, FormControlLabel, Grid, Link, Paper, TextField, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import {URL} from '../App';
import Visibility from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import axios from 'axios';


function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright Un_Knwn © '}
        <Link color="inherit" href="#">
          Event Management App
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    )
  }

  const { palette } = createTheme();
const { augmentColor } = palette;
  const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
  const defaultTheme = createTheme({
    palette: {
        tang: createColor('#222831')
      }
  });

const Signin = () => {
  
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  const handleSubmit = async(event) => {
    try {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      
      let email = data.get('email');
      let password = data.get('password');
         
    let res = await axios.post(`${URL}/users/signin`, {
      email,
      password
      })
      if(res.status === 200){
        navigate("/dashboard")
        sessionStorage.setItem("token", res.data.token);
        toast.success(res.data.message);
      }
    
  } catch (error) {
    toast.error(error.res.data.message);
  }   
    };
      
  return (
    
    <div>
        <header>
        <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{background:"#222831"}}>
        <Toolbar>
          <Typography variant="h6" textAlign={"center"} component="div" sx={{ flexGrow: 1 }} >
          Zen Class Event Management
          </Typography>
          <Button color="inherit" onClick={()=>navigate("/register")}>Signup</Button>
        </Toolbar>
      </AppBar>
    </Box>
        </header>
        <br/>
        <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '80vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={3}
          md={7}
          lg={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 3,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                color='tang'
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                color='tang'
                label="Password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                color='tang'
                variant="contained"
                style={{cursor:"pointer"}}
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" color={"#222831"} variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" color={"#222831"} onClick={()=> navigate('/register')} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>

    </div>
  )
}

export default Signin