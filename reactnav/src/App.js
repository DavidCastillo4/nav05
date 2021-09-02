//App.js
import React, { useContext, useState } from 'react';
import { GlobalContext, GlobalProvider } from './Global';
import { Route, Link, Redirect, BrowserRouter, Switch } from 'react-router-dom';
import axios from "axios";
/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
let url = 'http://localhost:3201/';
let urlAuthenticate = url + 'authenticate'
let urlAuthorize = url + 'authorize';
let localStorageKey = 'jwt';
let setJwt = (token) => { localStorage.setItem(localStorageKey, token) }
let getJwt = () => { return localStorage.getItem(localStorageKey) }
let deleteJwt = () => { localStorage.removeItem(localStorageKey) }

let Home = () => { return (<h1>Home</h1>) };
let About = () => { return (<h1>About</h1>) };
let User = () => { return (<h1>User</h1>) };
let UserId = ({ match }) => { return (<h1>{match.params.id}</h1>); };
/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
let Login = (props) => {
 let [name, setName] = useState('');
 let [passWord, setPassWord] = useState('');
 let { Authenticated, setAuthenticated } = useContext(GlobalContext);
 let authenticate = async () => {
  let bodyData = { 'name': name, 'passWord': passWord };
  let data = await (await axios.post(urlAuthenticate, bodyData)).data;
  if (data.status) { setJwt(data.token) };
  setAuthenticated(data.status);
 };

 let path = props.location.targetPath;
 if (typeof (path) === "undefined") path = '/';
 return (Authenticated
  ? <Redirect to={path} />
  : <div>
   <input type='text' onChange={(e) => setName(e.target.value)} placeholder='Name=a'></input>
   <br />
   <input type='text' onChange={(e) => setPassWord(e.target.value)} placeholder='Password=a'></input>
   <br />
   <button onClick={authenticate}>Login</button>
  </ div>
 )
};
/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
let LogOut = () => {
 let { setAuthenticated } = useContext(GlobalContext);
 let logOut = () => {
  deleteJwt();
  setAuthenticated(0);
  <Redirect to={{ pathname: '/login' }} />
 };
 return (<button onClick={logOut}>Log out</button>)
};
/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
let Nav = (props) => {
 let css = { backgroundColor: 'lightcyan', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
 return (
  <nav>
   <span style={css}>
    <h3>Logo</h3>
    <Link to="/">Home</Link> <br />
    <Link to="/about">About</Link> <br />
    <Link to="/user">User</Link> <br />
    <Link to="/user/9901">UserById</Link> <br />
    <LogOut />
   </span>
   <br />
   {props.children}
  </nav>
 )
};
/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
let SecureRoute = (props) => {
 let { Authenticated, setAuthenticated } = useContext(GlobalContext);
 let validateToken = async () => {
  let storage = getJwt();
  let headerData = { headers: { 'token': storage } };
  let data = await (await axios.get(urlAuthorize, headerData)).data;
  if (!data.status) deleteJwt();
  setAuthenticated(data.status);
 };
 return (
  <Route exact path={props.path} render={(p) => {
   validateToken();
   return (Authenticated
    ? <props.component {...p} />
    : <Redirect to={{ pathname: '/login', targetPath: p.location.pathname }} />)
  }} />
 )
};

/*
Notice the slight difference in logic between SeureRoute & SecureRoute2.
If I replace the logic of SecureRoute with the SecureRoute2 logic, 
SecureRout will no longer work.  My question is why??
I know it wont work becasue the validateToken never get's called again after initial render, 
but I want to understand why??
*/

// let SecureRoute2 = (props) => {
//  let { Authenticated, setAuthenticated } = useContext(GlobalContext);
//  let validateToken = async () => {
//   let storage = getJwt();
//   let headerData = { headers: { 'token': storage } };
//   let data = await (await axios.get(urlAuthorize, headerData)).data;
//   if (!data.status) deleteJwt();
//   setAuthenticated(data.status);
//  };
//  validateToken();
//  return (
//   <Route exact path={props.path} render={(p) => (
//    Authenticated
//     ? <props.component {...p} />
//     : <Redirect to={{ pathname: '/login', targetPath: p.location.pathname }} />
//   )} />
//  )
// };

/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
let Router = () => {
 return (
  <Switch>
   <Route exact path="/login" component={Login} />
   <Nav>
    <SecureRoute exact path='/' component={Home} />
    <SecureRoute exact path='/about' component={About} />
    <SecureRoute exact path="/user" component={User} />
    <SecureRoute exact path="/user/:id" component={UserId} />
   </Nav>
  </Switch>
 )
};
/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
export let App = () => {
 return (
  <GlobalProvider>
   <BrowserRouter>
    <Router />
   </BrowserRouter>
  </GlobalProvider>
 );
};


