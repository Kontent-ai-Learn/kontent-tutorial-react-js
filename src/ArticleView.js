import React, { Component } from 'react';
import { DeliveryClient, Link } from 'kentico-cloud-delivery';

// const deliveryClient = new DeliveryClient({ projectId: '14372844-0a5d-434a-8423-605b8a631623' });
// const deliveryClient = new DeliveryClient({ projectId: '975bf280-fd91-488c-994c-2f04416e5ee3' });
// const deliveryClient = new DeliveryClient({ projectId: 'cc709c91-05b3-0090-ea55-aa3eddac1f84' }); //latest
const deliveryClient = new DeliveryClient({ projectId: 'a0a9d198-e604-007a-50c9-fecbb46046d1' }); //react test


class ArticleView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      article: null
    };
  }

  componentDidMount() {
    let slug = this.props.match.params.slug;
    console.log(slug);

    deliveryClient.item(slug)
      .depthParameter(0)
      .queryConfig({
        linkResolver: (link) => {
          console.log(`Resolving link ` + JSON.stringify(link));
          if (link.type === 'article') {
            // return `/post/${link.codename}`
            return (<Link to={`/post/${link.codename}`}>
            {link.codename}
          </Link>)
          }
          return "undefined";
        }
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

render() {
  if (this.state.loaded) {
    const article = this.state.article;
    const title = article.title.value;
    const bodyCopy = article.body_copy.getHtml();

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