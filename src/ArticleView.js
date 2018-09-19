import React, { Component } from 'react';
import { DeliveryClient } from 'kentico-cloud-delivery';

const deliveryClient = new DeliveryClient({ projectId: '14372844-0a5d-434a-8423-605b8a631623' });
// const deliveryClient = new DeliveryClient({ projectId: '975bf280-fd91-488c-994c-2f04416e5ee3' });
// const deliveryClient = new DeliveryClient({ projectId: 'cc709c91-05b3-0090-ea55-aa3eddac1f84' });


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
      .depthParameter(1)
      .queryConfig({
        linkResolver: (link) => {
          console.log(`Resolving link ${link}`);
          if (link.type === 'article') {
            return `/post/${link.urlSlug}`
          }
          return undefined;
        },
        richTextResolver: (item) => {
          console.log(`Resolving modular item: ${item}`);
          if (item.system.type === 'hosted_video') {
            let video = item;
            if (video.videoHost.value.find(item => item.codename === 'vimeo')) {
              return `<iframe class="hosted-video__wrapper"
                                    src="https://player.vimeo.com/video/${
                                      video.videoId.value
                                    }?title=0&byline=0&portrait=0"
                                    width="640"
                                    height="360"
                                    frameborder="0"
                                    webkitallowfullscreen
                                    mozallowfullscreen
                                    allowfullscreen
                                    >
                            </iframe>`;
            } else if (
              video.videoHost.value.find(item => item.codename === 'youtube')
            ) {
              return `<iframe class="hosted-video__wrapper"
                                    width="560"
                                    height="315"
                                    src="https://www.youtube.com/embed/${
                                      video.videoId.value
                                    }"
                                    frameborder="0"
                                    allowfullscreen
                                    >
                            </iframe>`;
            }
          }
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