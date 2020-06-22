import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import PostAddOutlinedIcon from "@material-ui/icons/PostAddOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Paper } from "@material-ui/core";
import xss from "xss";

// messages variables if any
let error, success;

const Register = ({ setIsNewUser }) => {
  // Registeration data
  const [newUserData, setNewUserData] = React.useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Styling classes
  const classes = useStyles();

  // Used to update registeration data
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submitting all registeration data and sanitizing them before sending
    if (newUserData.fullName && newUserData.email && newUserData.password) {
      const res = await fetch("/users", {
        method: "POST",
        body: xss(JSON.stringify(newUserData)),
        headers: {
          "Content-Type": "application/json",
        },
      });
      // if user is successfully registered
      if (res.status === 200) {
        error = "";
        success = "Successfully registered, you can login";
        setTimeout(() => setIsNewUser(false), 2000);
      }
      // existing email error
      else if (res.status === 421) {
        error = "Email is already taken";
      }
      // validation errors
      else if (res.status === 422) {
        error = generateErrorMessage(newUserData);
      }
      // server side problem
      else error = "some thing wrong happened";
    } else {
      error = "All fields are required";
    }
    setNewUserData({ ...newUserData });
  };

  return (
    <Container component="main" maxWidth="xs" className="d-flex h-100 mt-5">
      <Paper className="row p-5 align-self-center" elevation={3}>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <PostAddOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className="my-2">
            Register
          </Typography>
          {error && (
            <div className="alert alert-danger m-0" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success m-0" role="alert">
              {success}
            </div>
          )}
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="fullName"
              label="Full Name"
              type="fullName"
              id="fullName"
              onChange={handleInputChange}
              value={newUserData.fullName}
              autoFocus
            />
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
              value={newUserData.email}
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
              value={newUserData.password}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit
            </Button>
          </form>
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

const generateErrorMessage = (data) => {
  // eslint-disable-next-line
  const regx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return (
    <ul className="m-0 p-0">
      {data.fullName.length < 6 && (
        <li>Full name must be at least 6 characters long</li>
      )}
      {data.fullName.length > 30 && (
        <li>Full name can't exceed 30 characters long</li>
      )}
      {regx.test(data.email) || <li>Invalid email format</li>}
      {data.password.length < 8 && (
        <li>Password must be at least 8 characters long</li>
      )}
    </ul>
  );
};

export default Register;
