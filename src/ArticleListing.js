import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {client} from "./config";

function ArticleListing() {
  const [isLoading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);

  const fetchArticles = () => {
    return client
      .items()
      .type("article")
      .elementsParameter(["url_pattern", "title"])
      .toObservable()
      .subscribe((response) => {
        setLoading(false);
        setArticles(response.items);
      });
  };

  useEffect(() => {
    const subscription = fetchArticles();
    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
