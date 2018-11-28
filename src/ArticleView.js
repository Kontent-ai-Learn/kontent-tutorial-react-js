import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { deliveryClient } from './DeliveryClientConfig';
import { resolveContentLink, resolveItemInRichText } from './resolvers';

class ArticleView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      article: null,
    };
  }

  fetchArticle(slug) {
    deliveryClient.items()
      .type('article')
      .equalsFilter('elements.url_pattern', slug)
      .depthParameter(1)
      .queryConfig({
        linkResolver: resolveContentLink,
        richTextResolver: resolveItemInRichText,
      })
      .getObservable()
      .subscribe((response) => {
        console.log(response);
        this.setState({
          loaded: true,
          article: response.items[0]
        });
      });
  }

  handleClick(event, richTextElement) {
    if (event.target.tagName === 'A' && event.target.hasAttribute('data-item-id')) {
      event.preventDefault();

      const id = event.target.getAttribute('data-item-id');
      const link = richTextElement.links.find(link => link.itemId === id);
      const newPath = resolveContentLink(link);
      if (newPath) {
        this.props.history.push(newPath);
      }
    }
  }

  componentDidMount() {
    let slug = this.props.match.params.slug;
    console.log(slug);
    this.fetchArticle(slug);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let oldSlug = this.props.match.params.slug;
    let newSlug = nextProps.match.params.slug;
    if (oldSlug !== newSlug) {
      this.fetchArticle(newSlug);
    }
  }

  render = (props) => {
    if (this.state.loaded) {
      const article = this.state.article;
      const title = article.title.value;
      const bodyCopy = article.body_copy;

      return (
        <div>
          <Link to="/">Home</Link>
          <h1>{title}</h1>
          <div className="article_body"
            dangerouslySetInnerHTML={{ __html: bodyCopy.getHtml() }}
            onClick={event => this.handleClick(event, bodyCopy)} />
        </div>
      );
    } else {
      return (
        <div>
          Loading...
        </div>
      );
    }
  }
}

export default ArticleView;