import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useForm, Controller } from "react-hook-form";
import { NavLink, useHistory, useLocation } from 'react-router-dom';

const axios = require('axios').default;


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="">
        Ankur Dwivedi
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(2),
    height: 120,
    width: 120,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  Radio: {
    flexDirection: "row"
  },
  error: {
    color: "red"
  },
  link: {
    textDecoration:"none",
    margin:"1rem"
  }
}));

export default function Login() {
  var bodyFormData = new FormData();
  let history = useHistory();
  const classes = useStyles();
  const { register, control, errors, handleSubmit } = useForm();
  const onSubmit = data =>login(data);

  const [ButtonName, setButtonName] = useState("Login")
  const [message, setMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const login = data => {
    axios.post(" /login", {
      email: data.email,
      password: data.password
    })
      .then(function (response) {
        if(response.data.status && response.data.status==="Email or password is incorrect"){
          setMessage(response.data.status)
          handleClickOpen()
        }
        else {
          localStorage.setItem("token",response.data[0].token)
          localStorage.setItem("email",response.data[0].email)
          history.push("/")
          // console.log(response)
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
       <div className={classes.paper}>
       <Typography variant="h3" className={classes.title}>
           Login
          </Typography>
          </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
         
          <div className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  // defaultValue={path.length === 11 ? path[5] : ""}
                  defaultValue={""}

                  inputRef={register({
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "invalid email address"
                    }
                  })}
                />
                {errors.email?.type === "required" && <span className={classes.error}>Enter your email address</span>}
                {errors.email?.type === "pattern" && <span className={classes.error}>{errors.email.message}</span>}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  // defaultValue={path.length === 11 ? path[6] : ""}
                  defaultValue={""}
                  inputRef={register({ required: true , maxLength: 25})}
                />
                {errors.password?.type === "required" && <span className={classes.error}>Set password</span>}
                {errors.password?.type === "maxLength" && <span className={classes.error}>Password can have only 25 character</span>}
              </Grid>
             
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="check" color="primary" inputRef={register({ required: true })} />}
                  label="I agree terms and conditions"
                />
              </Grid>
              {errors.check?.type === "required" && <span className={classes.error}>please agree to terms and condition</span>}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {ButtonName}
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <NavLink to="/" variant="body2"  className={classes.link}>
                  Discard
                </NavLink>
                <NavLink to="/signup" variant="body2"  className={classes.link}>
                  Signup
                </NavLink>
              </Grid>
            </Grid>
          </div>
        </form>
      </div>
      <Box mt={15}>
        <Copyright />
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.dialog}
      >
        <DialogTitle id="alert-dialog-title" >{message+"..."}</DialogTitle>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
