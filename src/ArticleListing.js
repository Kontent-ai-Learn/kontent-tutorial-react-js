import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { DeliveryClient } from 'kentico-cloud-delivery';

const deliveryClient = new DeliveryClient({ projectId: '975bf280-fd91-488c-994c-2f04416e5ee3' });

class ArticleListing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  fetchArticles() {
    deliveryClient.items()
      .type('article')
      .getObservable().subscribe(response => {
        console.log(response.items);
        this.setState({
          loaded: true,
          articles: response.items
        });
      });
  }

  componentWillMount() {
    this.fetchArticles();
  }

  render() {
    if (this.state.loaded) {
      return (
        <div>
          {this.state.articles.map((article) => {
            return (
              <div key={article.url_pattern.value}>
                <Link to={`/post/${article.system.codename}`}>
                  {article.title.text}
                </Link>
              </div>
            )
          })}

        </div>
      );
    } else {
      return (
        <div>
          Loading...
          </div>
      )
    }
  }
}

export default ArticleListing;