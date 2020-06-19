import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from './components/Home';
import Sources from './components/Sources';
import "./App.css";

export const UserContext = React.createContext(null);
function App() {
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user")) || null);
  const providerValue = { user, setUser };

  return (
    <UserContext.Provider value={providerValue}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/sources" component={Sources} />
        </Switch>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
