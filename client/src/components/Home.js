import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { useHistory } from 'react-router-dom';
import CardView from "./CardView"
import Header from "./Header"
import Avatar from '@material-ui/core/Avatar';

import { RemoveShoppingCart } from '@material-ui/icons';

const axios = require('axios').default;

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" >
        Ankur Dwivedi
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  avatar: {
    margin: theme.spacing(2),
    height: 120,
    width: 120,
    backgroundColor: theme.palette.secondary.main,
  },
  avatar2: {
    margin: theme.spacing(2),
    width: 120,
    fontWeight:500
  }
}));


export default function Home() {
  const classes = useStyles();
  let history = useHistory();
  const [data, setData] = useState([])
  const [user, setUser] = useState([])
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [image, setImage] = useState("");
  const [role, setRole] = useState("");
  const [email,setEmail]=useState("");
  const [name,setName]=useState("");
  const [display,setDisplay]=useState("none");

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    load()
    loadStaff()
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
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }, [auth])

  const load = () => {
    setData([])
    axios.get(" /story")
      .then(function (response) {
        setData(response.data)
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const loadStaff = () => {
    axios.get("/users")
      .then(function (response) {
        setUser(response.data)
        console.log(response.data)
        })
      .catch(function (error) {
        console.log(error);
      })
  }

  const changeAuth=()=>{
    load()
    setImage("")
          setEmail("")
          setName("")
          setRole("")
    setAuth(setAuth(false))
  }

  return (
    <React.Fragment>
      <Header changeAuth={changeAuth}/>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              NewsRoom
            </Typography>
            {localStorage.getItem("token")?
            role==="chief editor"?
            <span>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Click on add to add new roles, stories will be displayed below.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => history.push("/add")}>
                    Add new roles
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => {display==="none"?setDisplay(""):setDisplay("none")}} style={{marginLeft:"1rem"}}>
                    Staff
                  </Button>
                </Grid>
              </Grid>
            </div>
            </span>
            :
            role==="Writer"?
            <span>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Click on add to add new story,Added stories will be displayed below.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => history.push("/add_story")}>
                    Add Story
                  </Button>
                </Grid>
              </Grid>
            </div>
            </span>
            :""
            :""}
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md" style={{display:display}}>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Staff
            </Typography>
          <Grid container spacing={4}>
          {user.map((data) => (
              role==="chief editor" && data.role!=="public"?<div>
              <Avatar alt="Remy Sharp" className={classes.avatar} src={"./uploads/" +data.image} />
              <p style={{display:"inline-block",textAlign:"center",fontSize:"0.85rem"}} className={classes.avatar2}>{data.role+"\n"+data.email}</p>
              </div>
              :""
            ))}
          </Grid>
        </Container>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
            <Grid container spacing={4}>
            {data.map((data) => (
              ((role==="public"||!localStorage.getItem("token")) && data.status==="published")||
              (role==="Writer"&&email===data.writer)||(role==="chief editor")||
              (role==="Editors" && data.status.indexOf(email)!==-1)||
              (role==="Legal Department" && data.status==="legal")?
              < CardView data={data} key={data.id} load={load} />
              :""
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer} >
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}