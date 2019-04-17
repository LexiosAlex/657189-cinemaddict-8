export const getTopCommentData = (data) => {
  const topCommentSort = data.slice();
  topCommentSort.sort((a, b) => {
    return b.comments.length - a.comments.length;
  });

  topCommentSort.forEach((it) => {
    it.controlsDeactivate = true;
  });

  return topCommentSort.slice(0, 2);
};

export const getTopRatedData = (data) => {
  const topRatedSort = data.slice();
  topRatedSort.sort((a, b) => {
    return b.rating - a.rating;
  });

  topRatedSort.forEach((it) => {
    it.controlsDeactivate = true;
  });

  return topRatedSort.slice(0, 2);
};
