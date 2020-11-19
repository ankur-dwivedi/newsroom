import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MenuItem, InputLabel, Select } from "@material-ui/core";
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
  }
}));

export default function Form() {
  var bodyFormData = new FormData();
  let history = useHistory();
  const classes = useStyles();
  const { register, control, errors, handleSubmit } = useForm();

  // let path = decodeURI(useLocation().pathname).split("/")
  // console.log(path)
  // const onSubmit = data => { path.length !== 11 ? save(data) : update(data) };
  const onSubmit = data =>save(data);

  // const [ButtonName, setButtonName] = useState(path.length === 11 ? "UPDATE" : "ADD")
  const [ButtonName, setButtonName] = useState("ADD")
  const [message, setMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };  const [image, setImage] = useState("")
  const show = event => {
    if (event.target.files[0])
      setImage(URL.createObjectURL(event.target.files[0]))
  }

  React.useEffect(() => {

  }, [])

  const upload = () => {
    axios({
      method: 'post',
      url: '/upload',
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(function (response) {
        // console.log(response);
        history.push("/")
      })
      .catch(function (response) {
        console.log(response);
      });
  }

  const save = data => {
    bodyFormData.append('photo', data.image[0]);
    axios.post(" /users", {
      name: data.firstname+" "+data.lastname,
      email: data.email,
      gender: data.gender,
      image: data.image[0].name,
      role: data.role,
      specialization: data.specialization,
      birthday: data.birthday,
      password: data.password
    })
      .then(function (response) {
        if(response.data.status==="email allready registered"){
          setMessage(response.data.status)
          handleClickOpen()
        }
        else if(response.data.status==="registered")
        upload()
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  // const update = data => {
  //   if (data.image[0])
  //     bodyFormData.append('photo', data.image[0]);
  //   axios.post(" /update", {
  //     id: path[2],
  //     firstname: data.firstname,
  //     lastname: data.lastname,
  //     email: data.email,
  //     gender: data.gender,
  //     image: data.image[0] ? data.image[0].name : path[10],
  //     role: data.role,
  //     specialization: data.specialization,
  //     birthday: data.birthday
  //   })
  //     .then(function (response) {
  //       if (data.image[0])
  //         upload()
  //       else
  //         history.push("/")
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     })
  // }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={classes.paper}>
            <Avatar alt="Remy Sharp" className={classes.avatar} src={image} />
            <Button
              variant="contained"
              component="label"
              color="primary">
              Upload Image
            <input
                type="file"
                style={{ display: "none" }}
                name="image"
                onChange={show}
                accept="image/x-png,image/gif,image/jpeg"
                // ref={register(path.length !== 11 ? { required: true } : {})}
                ref={register({ required: true })}

              />
            </Button>
            {errors.image?.type === "required" && <spam className={classes.error}>Choose an image</spam>}
          </div>
          <div className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstname"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  // defaultValue={path.length === 11 ? path[3] : ""}
                  defaultValue={""}
                  //autoFocus
                  inputRef={register({ required: true,
                     maxLength: 25, pattern: /^[A-Za-z]+$/i })}
                />
                {errors.firstname?.type === "required" && <spam className={classes.error}>Enter your first name</spam>}
                {errors.firstname?.type === "pattern" && <spam className={classes.error}>Alphabetical characters only</spam>}
                {errors.firstname?.type === "maxLength" && <spam className={classes.error}>Firstname can have only 25 character</spam>}

              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastname"
                  label="Last Name"
                  name="lastname"
                  autoComplete="lname"
                  // defaultValue={path.length === 11 ? path[4] : ""}
                  defaultValue={""}
                  inputRef={register({ required: true,
                     maxLength: 25, pattern: /^[A-Za-z]+$/i })}
                />
                {errors.lastname?.type === "required" && <spam className={classes.error}>Enter your last name</spam>}
                {errors.lastname?.type === "pattern" && <spam className={classes.error}>Alphabetical characters only</spam>}
                {errors.lastname?.type === "maxLength" && <spam className={classes.error}>Lastname can have only 25 character</spam>}

              </Grid>
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
                {errors.email?.type === "required" && <spam className={classes.error}>Enter your email address</spam>}
                {errors.email?.type === "pattern" && <spam className={classes.error}>{errors.email.message}</spam>}
              </Grid>

              {/* <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="specialization"
                  label="Specialization"
                  type="text"
                  id="specialization"
                  // defaultValue={path.length === 11 ? path[6] : ""}
                  defaultValue={""}
                  inputRef={register({ required: false , maxLength: 25})}
                />
                {errors.specialization?.type === "maxLength" && <spam className={classes.error}>Specialization can have only 25 character</spam>}

              </Grid> */}
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
                {errors.password?.type === "required" && <spam className={classes.error}>Set password</spam>}
                {errors.password?.type === "maxLength" && <spam className={classes.error}>Password can have only 25 character</spam>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="date"
                  label="Birthday"
                  type="date"
                  // defaultValue={path.length === 11 ? path[7] : "2020-10-24"}
                  defaultValue={"2020-10-24"}
                  name="birthday"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputRef={register({ required: true })}
                />
                {errors.birthday?.type === "required" && <spam className={classes.error}>Enter your birth date</spam>}
              </Grid>
              <Grid item xs={12} >
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup aria-label="gender" className={classes.Radio} 
                // defaultValue={path.length === 11 ? path[8] : ""}
                defaultValue={""}
                >
                  <FormControlLabel value="male" name="gender" inputRef={register({ required: true })} control={<Radio color="primary" />} label="Male" />
                  <FormControlLabel value="female" name="gender" inputRef={register({ required: true })} control={<Radio color="primary" />} label="Female" />
                  <FormControlLabel value="other" name="gender" inputRef={register({ required: true })} control={<Radio color="primary" />} label="Other" />
                </RadioGroup>
                {errors.gender?.type === "required" && <spam className={classes.error}>Select your gender</spam>}
              </Grid>

              <Grid item xs={12} >
                <InputLabel id="label" >Specialization</InputLabel>
                <Controller
                  name="specialization"
                  control={control}
                  defaultValue={"Technology"}
                  as={
                    <Select labelId="label" id="select"   >
                      <MenuItem value="Technology">Technology</MenuItem>
                      <MenuItem value="Design">Design</MenuItem>
                      <MenuItem value="Culture">Culture</MenuItem>
                      <MenuItem value="Business">Business</MenuItem>
                      <MenuItem value="Politics">Politics</MenuItem>
                      <MenuItem value="Science">Science</MenuItem>
                      <MenuItem value="Style">Style</MenuItem>
                      <MenuItem value="Health">Health</MenuItem>
                      <MenuItem value="Travel">Travel</MenuItem>
                      <MenuItem value="Opinion">Opinion</MenuItem>
                    </Select>
                  }
                />

              </Grid>
              <Grid item xs={12} >
                <InputLabel id="label" >Role</InputLabel>
                <Controller
                  name="role"
                  control={control}
                  // defaultValue={path.length === 11 ? path[9] : "Writer"}
                  defaultValue={"Writer"}

                  as={
                    <Select labelId="label" id="select"   >
                      <MenuItem value="Writer">Writer </MenuItem>
                      <MenuItem value="Editors">Editors</MenuItem>
                      <MenuItem value="Legal Department">Legal Department</MenuItem>
                    </Select>
                  }
                />

              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="check" color="primary" inputRef={register({ required: true })} />}
                  label="I agree terms and conditions"
                />
              </Grid>
              {errors.check?.type === "required" && <spam className={classes.error}>please agree to terms and condition</spam>}
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
                <NavLink to="/" variant="body2">
                  Discard
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
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description">
           Click ok to continue 
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
