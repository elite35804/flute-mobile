export const state = {
  users: [],
  isLoading: false,
  currentUserId: null,
  userPerPage: 50,
  totalRecords: 0,
  activePage: 1,
  filteredUsers: [],
  socialUsers: [],
  isVisibleIG: true,
  socialFilter: {},
  campaigns: [],
  transactions: [],
  tabs: [],
  socialCb: null,
  userList: userNamespace =>
    Object.values(userNamespace.users)
      .sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return 1;
        } else if (a.createdAt < b.createdAt) {
          return -1;
        }
        return 0;
      })
      .slice(0, userNamespace.userPerPage)
}
