import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from './components/Home';
import Sources from './components/Sources';
import { checkAuthenticated } from './components/helpers';
import "./App.css";
import Navbar from "./components/NavBar";

export const AuthContext = React.createContext(null);
function App() {
  const [ authenticated, setAuthenticated ] = React.useState(false);
  const providerValue = { authenticated, setAuthenticated };

  React.useEffect(() => {
    checkAuthenticated().then(res => setAuthenticated(res));
  },[])

  return (
    <AuthContext.Provider value={providerValue}>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/sources" component={Sources} />
        </Switch>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
