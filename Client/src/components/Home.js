import React from "react";
import { UserContext } from "../App";
import Login from "./Login";
import { fetchData } from "./helpers";
import NewsCard from "./NewsCard";
import { Container } from "@material-ui/core";

const Home = () => {
  const { user } = React.useContext(UserContext);
  const [articles, setArticles] = React.useState([]);

  React.useEffect(() => {
    fetchData("news/stream").then((response) => setArticles(response));
  }, [user]);

  

  if (!user) return <Login />;
  else
    return (
      <Container style={{width: '80%'}} className="d-flex h-100 justify-content-center">
        <div className="row p-5 justify-content-center align-self-center">
          {articles.map((article) => {
            return (
            <NewsCard key={article.title} article={article} />
            );
          })}
        </div>
      </Container>
    );
};

export default Home;