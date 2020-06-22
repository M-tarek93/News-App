import React from "react";
import { AuthContext } from "../App";
import Login from "./Login";
import { fetchData } from "./helpers";
import NewsCard from "./NewsCard";
import { Container } from "@material-ui/core";

const Home = () => {
  // Authentication status context
  const { authenticated } = React.useContext(AuthContext);
  // Articles array state
  const [articles, setArticles] = React.useState([]);
  React.useEffect(() => {
    // Fetching news feed if the user is authenticated
    authenticated &&
      fetchData("news/stream").then((response) => setArticles(response));
  }, [authenticated]);

  // Redirect the user if he is not logged in or when he log out
  if (!authenticated) return <Login />;
  else
    return (
      <Container
        style={{ width: "80%" }}
        className="d-flex h-100 justify-content-center"
      >
        <div className="row p-5 justify-content-center align-self-center">
          <h4 className="mt-5">
            {articles.length === 0 ? "No articles found" : ""}
          </h4>
          {articles.map((article) => {
            return <NewsCard key={article.title} article={article} />;
          })}
        </div>
      </Container>
    );
};

export default Home;
