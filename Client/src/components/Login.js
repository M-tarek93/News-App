import React from "react";
import { AuthContext } from "../App";
import xss from "xss";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Register from "./Register";
import { Paper } from "@material-ui/core";

// error variable if any
let error = "";

const Login = () => {
  // Authentication context used to set its state
  const { setAuthenticated } = React.useContext(AuthContext);
  // Auth data state
  const [authData, setAuthData] = React.useState({
    email: "",
    password: "",
  });
  // Flag to check if the user has an account or not
  const [isNewUser, setIsNewUser] = React.useState(false);

  // Styling classes
  const classes = useStyles();

  // Used to update authData state as the user types them
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setAuthData({ ...authData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if the user submits the form with both of email & password
    if (authData.email && authData.password) {
      // Calling the login end-point and sanitizing data before sending to prevent XSS
      const res = await fetch("/auth/login", {
        method: "POST",
        body: xss(JSON.stringify(authData)),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // if user is successfully logged in
      if (res.status === 200) {
        setImmediate(() => setAuthenticated(true));
        error = "";
      }
      // if no user was found in DB or invalid email/password combination
      else if (res.status === 401) error = "Invalid credintials";
      // server side problem
      else error = "some thing wrong happened";
      setAuthData({ email: "", password: "" });
    } else {
      // if user didin't enter his email and password
      error = "All fields are required";
      setAuthData({ email: authData.email, password: authData.password });
    }
  };
  // Render the register page if the user clicked on the Register button
  if (isNewUser) return <Register setIsNewUser={setIsNewUser} />;
  else
    return (
      <Container component="main" maxWidth="xs" className="d-flex h-100 mt-5">
        <Paper className="row p-5 align-self-center" elevation={3}>
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" className="my-2">
              Welcome to News-App
            </Typography>
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required={true}
                fullWidth
                id="email"
                label="Email"
                type="email"
                name="email"
                onChange={handleInputChange}
                value={authData.email}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleInputChange}
                value={authData.password}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
              >
                Login
              </Button>
            </form>
            <div>
              <Typography component="p" className="my-4">
                Don't have an account?
                <Button
                  className="ml-1"
                  onClick={() => setIsNewUser(true)}
                  style={{ textTransform: "none", color: "#424242" }}
                >
                  Register
                </Button>
              </Typography>
            </div>
          </div>
        </Paper>
      </Container>
    );
};

//style settings for the material form
const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#424242",
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
    color: "white",
    backgroundColor: "#424242",
    "&:hover": {
      backgroundColor: "#424242",
      color: "white",
    },
  },
}));

export default Login;
