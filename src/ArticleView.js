import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { DeliveryClient } from 'kentico-cloud-delivery';
import { resolveContentLink, resolveItemInRichText } from './resolvers';

// const deliveryClient = new DeliveryClient({ projectId: '14372844-0a5d-434a-8423-605b8a631623' });
// const deliveryClient = new DeliveryClient({ projectId: '975bf280-fd91-488c-994c-2f04416e5ee3' });
// const deliveryClient = new DeliveryClient({ projectId: 'cc709c91-05b3-0090-ea55-aa3eddac1f84' }); //latest
const deliveryClient = new DeliveryClient({ projectId: 'a0a9d198-e604-007a-50c9-fecbb46046d1' }); //react test

class ArticleView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      article: null,
    };
  }

  fethcArticle(slug) {
    deliveryClient.item(slug)
      .depthParameter(2)
      .queryConfig({
        linkResolver: resolveContentLink,
        richTextResolver: resolveItemInRichText,
      })
      .getObservable()
      .subscribe((response) => {
        console.log(response.item);
        this.setState({
          loaded: true,
          article: response.item
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
    this.fethcArticle(slug);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let oldSlug = this.props.match.params.slug;
    let newSlug = nextProps.match.params.slug;
    if (oldSlug !== newSlug) {
      this.fethcArticle(newSlug);
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
          <div
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