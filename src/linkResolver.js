export const resolveContentLink = (link) => {
  if (link.type === 'article') {
    return `/post/${link.urlSlug}`;
  }
  return undefined;
};