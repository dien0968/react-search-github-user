import React from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import loadingImage from '../images/preloader.gif';
import { GithubContext } from '../context/context';
const Dashboard = () => {

  const data = React.useContext(GithubContext)
  const {isLoading} = React.useContext(GithubContext)
  // console.log('data', data)

  if(isLoading){
    return (
      <main>
        <Navbar />
        <Search />
        <img src = {loadingImage} className = "loading-img" alt = "Loading..." />
      </main>
    )    
  }
  return (
    <main>
      <Navbar></Navbar>
      <Search></Search>
      <Info />
      <User />
      <Repos />
    </main>
  );
};

export default Dashboard;
