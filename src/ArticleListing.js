import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { deliveryClientInstance } from './deliveryClientConfig';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

let unsubscribeSubject = new Subject();

class ArticleListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  fetchArticles() {
    deliveryClientInstance.items()
      .type('article')
      .elementsParameter(['url_pattern', 'title'])
      .getObservable()
      .pipe(takeUntil(unsubscribeSubject))
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
    unsubscribeSubject.next();
    unsubscribeSubject.complete();
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
                <Link to={`/post/${article.elements.url_pattern.value}`}>
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