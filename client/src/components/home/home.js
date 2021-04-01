import React from 'react';
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet';

import TopNav from '../navbar/TopNav';
import Navbar from '../navbar/navbar';
import '../../App.scss';
import './style.css';

const Home = () => {
  const history = useHistory();
  
  !localStorage.getItem('profile') && history.push("/auth");
  return (
    <div>
      <Helmet>
          <title>Quizzy - Home</title>
      </Helmet>
      <TopNav  where={"Welcome"}/>
      <div className="container center mt-4 letter-spacing">
        <h1 className="big-text">Quizzy</h1>
        </div>
      <Navbar />
    </div>
  );
}

export default Home;