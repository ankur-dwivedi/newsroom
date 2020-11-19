import React from 'react';
import Form from "./components/Form";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddStory from "./components/AddStory";
import Story from "./components/Story";
import EditStory from "./components/EditStory";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

function App(props) {
  return(
  <Router>
    <div>
      <main>
      
        <Switch>
        <Route exact path="/" render={props =><div><Home key={"home"} {...props}/></div>}></Route>
        <Route exact path="/add" render={props =><Form key={"add"} {...props}/>}></Route>
        <Route exact path="/add_story" render={props =><AddStory key={"add story"} {...props}/>}></Route>
        <Route exact path="/login" render={props =><Login key={"login"} {...props}/>}></Route>
        <Route exact path="/signup" render={props =><Signup key={"signup"} {...props}/>}></Route>
        <Route exact path="/:id" render={props =><Story key={"story"} {...props}/>}></Route>
        <Route exact path="/edit/:id" render={props =><EditStory key={"Edit story"} {...props}/>}></Route>
        {/* <Route  path="/update/" render={props =><Form key={"update"} {...props}/>}></Route> */}
        </Switch>
      </main>
    </div>
    
  </Router>
  );
}


export default App;
