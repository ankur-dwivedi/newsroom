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
import { useHistory,useParams } from 'react-router-dom';
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

export default function EditStory() {
  var bodyFormData = new FormData();
  let history = useHistory();
  let {id}=useParams();
  const classes = useStyles();
  const { register, control, errors, handleSubmit } = useForm();

  const onSubmit = data => save(data);
  const [ButtonName, setButtonName] = useState("ADD")
  const [message, setMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [topic, setTopic] = React.useState("");
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
  const changeTitle = (e) => {
    setTitle(e.target.value)
  }


  React.useEffect(() => {
      load()
     
  }, [])

  

  const load = () => {
    axios.post(" /storyId",{
        id:id
    })
      .then(function (response) {
        setModel(response.data[0].description)
        setTitle(response.data[0].title)
        setImage(response.data[0].image)
        setTopic(response.data[0].topic)
        })
      .catch(function (error) {
        console.log(error);
      })
  }
  const config = {
    placeholderText: 'Add Your Story Here',
    charCounterCount: false
  }
  

  const save = data => {
   
    axios.post(" /updateStory", {
      title:title,
      description:model,
      id:id,
      topic:data.topic && data.topic!==""?data.topic:topic
    })
      .then(function (response) {
        console.log(response)
        history.push("/")
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={classes.paper}>
            <Avatar alt="Remy Sharp" className={classes.avatar} src={window.location.href.substring(0,window.location.href.indexOf("/edit"))+"/uploads/" +image} />
            
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
                  onChange={changeTitle}
                  value={title}

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
                  defaultValue={topic}
                  value={topic}
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
              Update
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
