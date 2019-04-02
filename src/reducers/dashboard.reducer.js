const initState = {
  showDrawer: false
};

const dashboardReducer = (state = { initState }, action) => {
  switch (action.type) {
    case "toggleDrawer":
      return {
        ...state,
        showDrawer: action.showDrawer
      };
    case "currentPage":
      return {
        ...state,
        currentPage: action.currentPage
      };
    case "showColor":
      return {
        ...state,
        showColor: action.showColor
      };
    case "doSearch":
      return {
        ...state,
        searchText: action.searchText
      };
    default:
      return state;
  }
};

export default dashboardReducer;
