export const state = {
  comments: {},
  isLoading: false,
  currentCommentId: null,
  commentPerPage: 10,
  totalRecords: 10,
  activePage: 1,
  commentList: commentNamespace =>
    Object.values(commentNamespace.comments)
      .sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return 1
        } else if (a.createdAt < b.createdAt) {
          return -1
        }

        return 0
      })
      .slice(0, commentNamespace.commentPerPage)
}