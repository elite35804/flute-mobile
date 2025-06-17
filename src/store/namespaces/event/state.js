export const state = {
  events: {},
  isLoading: false,
  currentEventId: null,
  eventPerPage: 10,
  totalRecords: 10,
  activePage: 1,
  eventList: eventNamespace =>
    Object.values(eventNamespace.events)
      .sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return 1
        } else if (a.createdAt < b.createdAt) {
          return -1
        }
        return 0
      })
      .slice(0, eventNamespace.eventPerPage)
}