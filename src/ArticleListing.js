import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {deliveryClient } from "./config";

function ArticleListing() {
  // Uses the React state hook
  const [articles, setArticles] = useState([]);
  const [isLoading, setLoading] = useState(true);

  // Gets URL slugs and titles of all articles in the project
  const getArticles = () => {
    return deliveryClient 
      .items()
      .type("article")
      .elementsParameter(["url_pattern", "title"])
      .toObservable()
      .subscribe((response) => {
        setArticles(response.items);
        setLoading(false);
      });
  };

  useEffect(() => {
    const subscription = getArticles();
    return () => subscription.unsubscribe();
  }, []);

  // Shows loading until the app gets article from Kontent
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Displays a list of the retrieved articles with links to their detail
  return (
    <ul>
      {articles.map((article) => {
        return (
          <li key={article.url_pattern.value}>
            <Link to={`/post/${article.url_pattern.value}`}>{article.title.value}</Link>
          </li>
        );
      })}
    </ul>
  );
}

export default ArticleListing;