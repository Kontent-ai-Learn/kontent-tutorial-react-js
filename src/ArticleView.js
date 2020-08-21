import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {client} from "./config";
import {resolveContentLink} from "./linkResolver";
import {resolveItemInRichText} from "./itemResolver";

function ArticleView({match, history}) {
  const [isLoading, setLoading] = useState(true);
  const [article, setArticle] = useState({});

  const fetchArticle = (slug) => {
    return client
      .items()
      .type("article")
      .equalsFilter("elements.url_pattern", slug)
      .depthParameter(1)
      .queryConfig({
        urlSlugResolver: resolveContentLink,
        richTextResolver: resolveItemInRichText
      })
      .toObservable()
      .subscribe((response) => {
        setArticle(response.items[0]);
        setLoading(false);
      });
  };

  useEffect(() => {
    const subscription = fetchArticle(match.params.slug);
    return () => subscription.unsubscribe();
  }, [match.params.slug]);
  
  const handleClick = (event, richTextElement) => {
    if (event.target.tagName === 'A' && event.target.hasAttribute('data-item-id')) {
      event.preventDefault();

      const id = event.target.getAttribute('data-item-id');
      const link = richTextElement.links.find(link => link.linkId === id);
      const newPath = resolveContentLink(link).url;
      if (newPath) history.push(newPath);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link to='/'>Home</Link>
      <h1>{article.title.value}</h1>
      <div
        className='article_body'
        dangerouslySetInnerHTML={{__html: article.body_copy.resolveHtml()}}
        onClick={(event) => handleClick(event, article.body_copy)}
      />
    </div>
  );
}

export default ArticleView;
