import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { deliveryClient } from './DeliveryClientConfig';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

let unsubscribe = new Subject();

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
      .elementsParameter(['url_pattern', 'title'])
      .getObservable()
      .pipe(takeUntil(unsubscribe))
      .subscribe(response => {
        console.log(response.items);
        this.setState({
          loaded: true,
          articles: response.items
        });
      });
  }

  componentDidMount() {
    this.fetchArticles();
  }

  unsubscribe() {
    unsubscribe.next();
    unsubscribe.complete();
    unsubscribe = new Subject();
  }

  componentWillUnmount() {
    this.unsubscribe();
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