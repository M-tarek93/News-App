import React from "react";
import Cookies from 'js-cookie';
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Switch,
} from "@material-ui/core";
import { flag } from "country-emoji";
import LocalOfferTwoToneIcon from "@material-ui/icons/LocalOfferTwoTone";
import LanguageTwoToneIcon from "@material-ui/icons/LanguageTwoTone";
import LocationOnTwoToneIcon from "@material-ui/icons/LocationOnTwoTone";
import { handleSubscription } from "./helpers";

const SourceCard = ({ source }) => {
  // Determinig if the user is subscribed to this source or not depending on his local storage sources
  const [checked, setChecked] = React.useState(
    JSON.parse(Cookies.get('sources')).includes(source.id)
  );

  // Styling classes
  const classes = useStyles();

  // Used to subscribe/unsubscribe from a source
  const handleChange = async () => {
    const action = !checked ? "subscribe" : "unsubscribe";
    handleSubscription(source.id, action);
    setChecked(!checked);
  };
  return (
    <Card className={classes.root}>
      <CardHeader
        title={source.name}
        action={
          <Switch checked={checked} onChange={handleChange} color="primary" />
        }
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {source.description}
        </Typography>
        <Typography paragraph variant="body2" className="m-2">
          <LocalOfferTwoToneIcon />
          {source.category}
          <LanguageTwoToneIcon className="ml-2" />
          {source.language}
          <LocationOnTwoToneIcon className="ml-2" />
          {flag(source.country)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SourceCard;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    [theme.breakpoints.down("sm")]: { width: "100%" },
    padding: 10,
    marginBottom: 20,
  },
}));
