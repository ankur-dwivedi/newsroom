import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { useHistory,useParams } from 'react-router-dom';
import Header from "./Header"
import ReactHtmlParser from 'react-html-parser';
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
}));


export default function Story() {
  const classes = useStyles();
  let history = useHistory();
  let {id}=useParams();
  const [data, setData] = useState([])
  const [writer, setWriter] = useState("")
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [image, setImage] = useState("");
  const [role, setRole] = useState("");
  const [email,setEmail]=useState("");
  const [name,setName]=useState("");

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {

    load()
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
          console.log(response)
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }, [])

  const load = () => {
    axios.post(" /storyId",{
        id:id
    })
      .then(function (response) {
          console.log(response)
        setData(response.data[0].description)
        setTitle(response.data[0].title)
        setWriter(response.data[0].writer)
        let data=response.data[0]
        setDate(new Date(data.added).toString(2).split(" ")[1] + " " + new Date(data.added).toString(2).split(" ")[2] + "," + new Date(data.added).toString(2).split(" ")[3])
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  return (
    <React.Fragment>
      <Header/>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
          <h5 style={{boxSizing:"inherit", margin:" 0px 0px 0.35em", fontSize:" 1.5rem",fontFamily: "roboto, helvetica, arial, sans-serif",
          fontWeight: 400, lineHeight: 1.334, letterSpacing: "0em", color: "rgba(0, 0, 0, 0.87)", fontStyle: "normal"}}
          >
            {title}</h5>
            <p style={{boxSizing:"inherit", margin:" 0px 0px 16px", fontSize:" 0.75rem",fontFamily: "roboto, helvetica, arial, sans-serif",
             fontWeight: 400, lineHeight: 1.66, letterSpacing: "0.0333em", color: "rgba(0, 0, 0, 0.87)", fontStyle: "normal"
            }}>{date+" by "}<a href="" style={{boxSizing: "inherit", margin: "0px", color: "rgb(25, 118, 210)", textDecoration: "none"}}>
            {writer}</a></p>
            {ReactHtmlParser(data)}
          </Container>
        </div>
      </main>
      {/* Footer */}
      <footer className={classes.footer} >
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}