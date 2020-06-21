import React from 'react';
import { UserContext } from '../App';
import Login from './Login';
import { fetchData } from './helpers';
import { Container } from '@material-ui/core';
import SourceCard from './SourceCard';

const Sources = () => {
    const { user } = React.useContext(UserContext);
    const [sources, setSources] = React.useState([]);
  
    React.useEffect(() => {
      user && fetchData("news/sources").then((response) => setSources(response));
    }, [user]);
  
    if (!user) return <Login />;
    else
      return (
        <Container style={{width: '100%'}} className="d-flex h-100 justify-content-center">
          <div className="row p-5 justify-content-center align-self-center">
            {sources.map((source) => {
              return (
              <SourceCard key={source.id} source={source}/>
              );
            })}
          </div>
        </Container>
      );}
 
export default Sources;