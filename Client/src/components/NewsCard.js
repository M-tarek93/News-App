import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from 'moment';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Collapse,
} from "@material-ui/core";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const NewsCard = ({article}) => {
  const [expanded, setExpanded] = React.useState(false);
  const classes = useStyles();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            {/* <MoreVertIcon /> */}
          </IconButton>
        }
        key={article.title}
        title={article.title}
        subheader={article.source.name + " " + moment(article.publishedAt).calendar()}
      />
      <CardMedia
        className={classes.media}
        image={article.urlToImage || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="}
        title={article.title}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {article.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>{article.content}</Typography>
          <Typography paragraph>Details: <a href={article.url}>Click here</a></Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default NewsCard;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    [theme.breakpoints.down("sm")]: { width: "100%" },
    padding: 10,
    marginBottom: 20
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: "red",
  },
}));
