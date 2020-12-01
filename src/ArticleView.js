import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { resolveItemInRichText } from "./itemResolver";
import { resolveContentLink } from "./linkResolver";
import { deliveryClient } from "./config";

function ArticleView({ match, history }) {
  // Uses the react state hook
  const [article, setArticle] = useState({});
  const [isLoading, setLoading] = useState(true);

  // Gets an article by its URL slug
  const getArticle = (slug) => {
    return deliveryClient
      .items()
      .type("article")
      .equalsFilter("elements.url_pattern", slug)
      .queryConfig({
        richTextResolver: resolveItemInRichText,
        urlSlugResolver: resolveContentLink
      })
      .toObservable()
      .subscribe((response) => {
        setArticle(response.items[0]);
        setLoading(false);
      });
  };

  useEffect(() => {
    const subscription = getArticle(match.params.slug);
    return () => subscription.unsubscribe();
  }, [match.params.slug]);

  // Shows loading until the app gets article from Kontent
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleClick = (event, richTextElement) => {
    // Checks if the user clicked on a link to a content item.
    if (event.target.tagName === 'A' && event.target.hasAttribute('data-item-id')) {
      event.preventDefault();
      const id = event.target.getAttribute('data-item-id');
      const link = richTextElement.links.find(link => link.linkId === id);
      const newPath = resolveContentLink(link).url;
      if (newPath) history.push(newPath);
    }
  }

  return (
    <div>
      <Link to='/'>Home</Link>
      <h1>{article.title.value}</h1>
      <div
        className='article_body'
        dangerouslySetInnerHTML={{ __html: article.body_copy.resolveHtml() }}
        // Registers your custom onClick handler
        onClick={(event) => handleClick(event, article.body_copy)}
      />
    </div>
  );
}

export default ArticleView;