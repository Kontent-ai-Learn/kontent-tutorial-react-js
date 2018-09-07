import React, { Component } from 'react';
import { DeliveryClient } from 'kentico-cloud-delivery';

const deliveryClient = new DeliveryClient({ projectId: '975bf280-fd91-488c-994c-2f04416e5ee3' });

class ArticleView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      article: null
    };
  }

  componentWillMount() {
    let slug = this.props.match.params.slug;
    console.log(slug);

    deliveryClient.item(slug)
      .depthParameter(1)
      .getObservable()
      .subscribe((response) => {
        console.log(response.item);
        this.setState({
          loaded: true,
          article: response.item
        });
      });
  }

  render() {
    if (this.state.loaded) {
      const article = this.state.article;
      const title = article.title.value;
      const bodyCopy = article.body_copy.value;

      return (
        <div>
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: bodyCopy }} />
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