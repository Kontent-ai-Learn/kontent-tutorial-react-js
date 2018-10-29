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

  componentDidMount() {
    let slug = this.props.match.params.slug;
    console.log(slug);
    this.getArticle(slug);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let oldSlug = this.props.match.params.slug;
    let newSlug = nextProps.match.params.slug;
    if (oldSlug !== newSlug) {
      this.getArticle(newSlug);
    }
  }

  getArticle(slug) {
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

  handleClick(e, richTextElement) {
    if (e.target.tagName === 'A' && e.target.hasAttribute('data-item-id')) {
      e.preventDefault();

      const id = e.target.getAttribute('data-item-id');
      const link = richTextElement.links.find(link => link.itemId === id);
      const newPath = resolveContentLink(link);
      if (newPath) {
        this.props.history.push(newPath);
      }
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
            onClick={e => this.handleClick(e, bodyCopy)} />
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