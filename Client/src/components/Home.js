import React from 'react';
import { UserContext } from '../App';
import Login from './Login';

const Home = () => {
  const { user } = React.useContext(UserContext);

    if (!user) return <Login />
    else return (
        <h1>Welcome</h1>
    )
}
 
export default Home;