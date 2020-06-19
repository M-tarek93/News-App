import React from "react";
import { UserContext } from "../App";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Register from "./Register";
import { Paper } from "@material-ui/core";

// error variable if any
let error = null;

const Login = () => {
  //user context that holds user info
  const { setUser } = React.useContext(UserContext);
  //auth data state
  const [authData, setAuthData] = React.useState({
    email: "",
    password: "",
  });
  const [isNewUser, setIsNewUser] = React.useState(false);

  const classes = useStyles();

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setAuthData({ ...authData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authData.email && authData.password) {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        body: JSON.stringify(authData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      // if user is successfully logged in
      if (res.status === 200) {
        const response = await res.json();
        localStorage.setItem("accessToken", response?.accessToken);
        localStorage.setItem("refreshToken", response?.refreshToken);
        localStorage.setItem("expAt", response?.expAt);
        const getUser = await fetch("http://localhost:5000/auth/me", {
          method: "POST",
          body: JSON.stringify({ token: response.accessToken }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const user = await getUser.json();
        localStorage.setItem("user", JSON.stringify(user?.user));
        setImmediate(() => setUser(user));
      }
      // if no user was found in DB or invalid email/password combination
      else if (res.status === 404 || res.status === 401)
        error = "Invalid credintials";
      // server side problem
      else error = "some thing wrong happened";
      setAuthData({ email: "", password: "" });
    }else{
      error = 'All fields are required'
      setAuthData({email: authData.email, password: authData.password})
    } 

  };
  if (isNewUser) return <Register setIsNewUser={setIsNewUser} />;
  else
    return (
      <Container component="main" maxWidth="xs" className="d-flex h-100">
        <Paper className="row p-5 align-self-center">
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
                label="email"
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
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
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
                <Button className="ml-1" onClick={() => setIsNewUser(true)} style={{ textTransform: 'none', color: '#424242'  }}>
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
    margin: theme.spacing(0, 0, 2),
    color: "white",
    backgroundColor: "#424242",
    "&:hover": {
      backgroundColor: "#424242",
      color: "white",
    },
  },
}));

export default Login;
