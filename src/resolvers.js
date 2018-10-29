export const linkResolver = (link) => {
  // console.log(`Resolving link ` + JSON.stringify(link));
  if (link.type === 'article') {
    return `/post/${link.codename}`;
  }
  return undefined;
};

export const richTextResolver = (item) => {
  // console.log(`Resolving item in Rich text: ${JSON.stringify(item)}`);
  if (item.system.type === 'hosted_video') {
    let video = item;
    if (video.video_host.value.find(item => item.codename === 'vimeo')) {
      return `<iframe class="hosted-video__wrapper"
                            src="https://player.vimeo.com/video/${
                              video.video_id.value
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
      video.video_host.value.find(item => item.codename === 'youtube')
    ) {
      return `<iframe class="hosted-video__wrapper"
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/${
                              video.video_id.value
                            }"
                            frameborder="0"
                            allowfullscreen
                            >
                    </iframe>`;
    }
  }
  return undefined;
};

