import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
const axios = require('axios').default;


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
    cursor:"pointer",
  },
}));


export default function Header(props) {
  const classes = useStyles();
  let history = useHistory();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [image, setImage] = useState("");
  const [role, setRole] = useState("");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
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
          console.log(response)
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }, [])

  

  return (
    <React.Fragment>
      <CssBaseline />
      {localStorage.getItem("token") && auth ?
        <AppBar position="static" style={{backgroundColor:"#e6e6ff"}}>
          <Toolbar>
            <Typography variant="h6" className={classes.title} style={{color:"#000"}} onClick={()=>history.push("/")}>
              NewsRoom
          </Typography>
            {(
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                <Avatar alt="Remy Sharp" src={"./uploads/" +image} />
                  {/* <AccountCircle /> */}
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>{name}</MenuItem>
                  {role!=="public"?<MenuItem onClick={handleClose}>{role}</MenuItem>:""}
                  <MenuItem onClick={() => { handleClose(); localStorage.clear(); props.changeAuth() }}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
        :
        <AppBar position="static" style={{backgroundColor:"#e6e6ff"}}>
          <Toolbar>
            <Typography variant="h6" className={classes.title} style={{color:"#000"}} onClick={()=>history.push("/")}>
              NewsRoom
          </Typography>
            <Button color="black" onClick={() => history.push("/login")}>Login</Button>
            <Button color="black" onClick={() => history.push("/signup")}>Signup</Button>
          </Toolbar>
        </AppBar>
      }
     
    </React.Fragment>
  );
}