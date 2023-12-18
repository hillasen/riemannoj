import React from 'react';
import { BrowserRouter, Route, Routes, createBrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from './Components/NavBar';

import Home from './Pages/Home'
import NotFound from './Pages/NotFound';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Logout from './Pages/Logout';
import Problem from './Pages/Problem';
import JudgeBoard from './Pages/JudgeBoard';
import Contest from './Pages/Contest';
import ContestJudgeBoard from './Pages/ContestJudgeBoard';
import ContestProblem from './Pages/ContestProblem';
import ContestRanking from './Pages/ContestRanking';
import CreateProblem from "./Pages/CreateProblem"
import CreateUser from './Pages/CreateUser';
import Contests from './Pages/Contests';

import { useEffect, useState } from "react";
import { fireStore, fireAuth } from "./Firebase";

import { onAuthStateChanged } from 'firebase/auth';

import { loginUser, logoutUser } from './Communicate/Auth';



function App() {
  const [user, setUser] = useState({});
  const currentUser = fireAuth.currentUser
  useEffect(() => {
    onAuthStateChanged(fireAuth, (currentUser) => { 
      setUser(currentUser);
      console.log(currentUser)
    });
  }, [user]);

  return (
    <div>
      <BrowserRouter>
        <NavBar user={user}/>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/Login" element={<Login/>}></Route>
          <Route path="/Register" element={<Register/>}></Route>
          <Route path="/ranking/:contestid" element={<ContestRanking/>}></Route>
          <Route path="/Logout" element={<Logout/>}></Route>
          <Route path="/judgeboard" element={<JudgeBoard/>}></Route>
          <Route path="/judgeboard/:contestid" element={<ContestJudgeBoard/>}></Route>
          <Route path="/problem/:problemid/:contestid" element={<ContestProblem/>}></Route>
          <Route path="/problem/:problemid" element={<Problem />}></Route>
          <Route path="/contest/:contestid" element={<Contest />}></Route>
          <Route path="/createproblem" element={<CreateProblem  />}></Route>
          <Route path="/createuser" element={<CreateUser />}></Route>
          <Route path="/contests" element={<Contests />}></Route>
          <Route path="*" element={<NotFound/>}></Route>
  
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
