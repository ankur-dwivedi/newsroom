import React from 'react';
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
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
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

        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={() => history.push("/update/" + data._id + "/" + data.firstname + "/" + data.lastname + "/" + data.email + "/" + data.address + "/" + data.birthday + "/" + data.gender + "/" + data.country + "/" + data.image)}>
            Edit
                    </Button>
          <Button size="small" color="primary" onClick={() => history.push("/" + data.id )}>
            view
                    </Button>
          <Button size="small" color="secondary" onClick={handleClickOpen}>
            Delete
                    </Button>
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
    </Grid>

  );
}



