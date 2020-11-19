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
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditorComponent from 'react-froala-wysiwyg';

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
    margin: theme.spacing(3, 4, 2,0),
  },
  Radio: {
    flexDirection: "row"
  },
  error: {
    color: "red"
  }
}));

export default function AddStory() {
  var bodyFormData = new FormData();
  let history = useHistory();
  const classes = useStyles();
  const { register, control, errors, handleSubmit } = useForm();

  const onSubmit = data => save(data);
  const [ButtonName, setButtonName] = useState("ADD")
  const [message, setMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }; const [image, setImage] = useState("")
  const show = event => {
    if (event.target.files[0])
      setImage(URL.createObjectURL(event.target.files[0]))
  }

  const [model, setModel] = useState()
  const handleModelChange = (model) => {
    setModel(model)
  }


  React.useEffect(() => {

  }, [])

  const config = {
    placeholderText: 'Add Your Story Here',
    charCounterCount: false
  }
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
    // console.log(data.title, data.image, data.topic, model)
    axios.post(" /story", {
      title: data.title,
      writer:localStorage.getItem("email"),
      status:"writer",
      image: data.image[0].name,
      description:model,
      topic:data.topic
    })
      .then(function (response) {
        console.log(response)
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
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={classes.paper}>
            <Avatar alt="Remy Sharp" className={classes.avatar} src={image} />
            <Button
              variant="contained"
              component="label"
              color="primary">
              Upload Cover Image
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
            {errors.image?.type === "required" && <span className={classes.error}>Choose an image</span>}
          </div>
          <div className={classes.form}>
            <Grid container spacing={2}>


              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  name="title"
                  autoComplete="title"
                  // defaultValue={path.length === 11 ? path[5] : ""}
                  defaultValue={""}

                  inputRef={register({
                    required: true
                  })}
                />
                {errors.title?.type === "required" && <span className={classes.error}>Enter Title</span>}
              </Grid>
              <Grid item xs={12} >

                <FroalaEditorComponent model={model}
                  config={config}
                  onModelChange={handleModelChange}
                  tag='textarea' />



              </Grid>

              <Grid item xs={12} >
                <InputLabel id="label" >Topic</InputLabel>
                <Controller
                  name="topic"
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
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {ButtonName}
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={()=>history.push("/")}
            >
              Discard
            </Button>
            
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
        <DialogTitle id="alert-dialog-title" >{message + "..."}</DialogTitle>
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
