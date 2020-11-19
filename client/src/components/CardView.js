import React,{useEffect,useState} from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { EditRounded } from '@material-ui/icons';
import { useForm, Controller } from "react-hook-form";
import Avatar from '@material-ui/core/Avatar';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
const axios = require('axios').default;


const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  text: {
    fontSize: 13
  },
  info: {
    fontWeight: 500,
    fontStyle: "bold",
    marginRight: 10
  },
  heading: {
    fontWeight: 700,
    fontStyle: "bold",
    fontSize: 20
  }
}));

export default function CardView(props) {
  const classes = useStyles();
  let history = useHistory();
  
  const [image, setImage] = useState("");
  const [role, setRole] = useState("");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [feature,setFeature]=useState("");
  const [editors,setEditors]=useState("");
  const [editorData,setEditorData]=useState([]);

  const { register, control, errors, handleSubmit } = useForm();
  const onSubmit = data =>{updateStatus(data)};

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openAssign, setOpenAssign] = React.useState(false);
  const handleClickOpenAssign = () => {
    setOpenAssign(true);
  };
  const handleCloseAssign = () => {
    setOpenAssign(false);
  };

  const assignEditors = () => {
    axios.post("/editor", {
      topic: data.topic
    })
      .then(function (response) {
        if(response.data.length===0)
        setEditors("Add "+props.data.topic+" Editor to continue")
        else{
          setEditors("")
          setEditorData(response.data)
        }
        
        console.log(response.data)
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const data = props.data

  const deleteStory = () => {
    axios.post("/delete", {
      id: data.id
    })
      .then(function (response) {
        props.load()
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  
  const updateStatus = data => {
    handleCloseAssign()
    let temp=""
    for(let x=0;x<data.check.length;x++)
      temp=temp+" "+data.check[x]
      console.log(temp,props.data.id)
    axios.post("/updateStoryStatus", {
      status: temp.trim(),
      id:""+props.data.id
    })
      .then(function (response) {
        props.load()
        console.log(response);
        
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  const updateStatusEditor = data => {
    axios.post("/updateStoryStatus", {
      status: data,
      id:""+props.data.id
    })
      .then(function (response) {
        props.load()
        console.log(response);
        
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  useEffect(() => {
    if(localStorage.getItem("token"))
    {
      axios.post("/userToken", {
        token: localStorage.getItem("token")
      })
        .then(function (response) {
          setImage(response.data[0].image)
          setEmail(response.data[0].email)
          setName(response.data[0].name)
          setRole(response.data[0].role)
          if(response.data[0].role==="Writer" && response.data[0].email===props.data.writer){
            
              setFeature(<span><Button size="small" color="primary" onClick={() => history.push("/edit/" + data.id )}>
              Edit
                      </Button>
            <Button size="small" color="secondary" onClick={handleClickOpen}>
              Delete
                      </Button></span>)
          }
          else if(response.data[0].role==="chief editor" && props.data.status==="writer"){
            
            setFeature(<span>
          <Button size="small" color="secondary" onClick={()=>{assignEditors();handleClickOpenAssign()}}>
            Assign
                    </Button></span>)
        }
        else if(response.data[0].role==="Editors" && props.data.status!="writer" && props.data.status!="legal" && props.data.status!="published"){
            
          setFeature(<span>
        <Button size="small" color="secondary" onClick={()=>{updateStatusEditor("legal")}}>
          Approve
                  </Button></span>)
      }
      else if(response.data[0].role==="Legal Department" && props.data.status==="legal" ){
            
        setFeature(<span>
      <Button size="small" color="secondary" onClick={()=>{updateStatusEditor("published")}}>
        Publish
                </Button></span>)
    }
          //console.log(response)
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }, [])
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image={"./uploads/" + data.image}
          title={data.title}
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom className={classes.heading} >
            {data.title}
          </Typography>
          <Typography className={classes.text} color="primary">{new Date(data.added).toString(2).split(" ")[1] + " " + new Date(data.added).toString(2).split(" ")[2] + " " + new Date(data.added).toString(2).split(" ")[3]}</Typography>
          <Typography className={classes.text}><span><span className={classes.info}>Writer:</span><span>{data.writer}</span></span></Typography>
          <Typography className={classes.text}><span><span className={classes.info}>Topic:</span><span>{data.topic}</span></span></Typography>

          
          <Typography className={classes.text}><span><span className={classes.info}>Status:</span><span>{data.status==="writer"?"Shared to Chief Editor":data.status}</span></span></Typography>
         
        </CardContent>
        <CardActions>
        <Button size="small" color="primary" onClick={() => history.push("/" + data.id )}>
            view
          </Button>
        {feature}
        </CardActions>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Do you want to delete " + data.title + " ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Click agree to continue or discard to cancel
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Discard
          </Button>
          <Button onClick={() => { deleteStory(); handleClose() }} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAssign}
        onClose={handleCloseAssign}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
      <DialogTitle id="alert-dialog-title">{"Select Editors "}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {editors}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={classes.paper}>
          {editorData.map((editor)=>
          <span>
            <FormControlLabel
                  control={<Checkbox name="check" color="primary" inputRef={register()} value={editor.email} />}
                  label={editor.email}
                />
                <br/></span>

          )}
          <br/>
          <Button onClick={handleCloseAssign} color="primary">
            Discard
          </Button>
          <Button
              type="submit"
              // fullWidth
              // variant="contained"
              color="primary"
              className={classes.submit}
            >
              Ok
            </Button>
          </div>
          </form>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleCloseAssign} color="primary">
            Discard
          </Button>
          <Button onClick={() => {  handleCloseAssign() }} color="primary" autoFocus>
            Ok
          </Button> */}
        </DialogActions>
      </Dialog>
    </Grid>
  );
}



