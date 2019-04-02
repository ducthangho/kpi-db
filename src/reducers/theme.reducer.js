const themeReducer = (state={ primary: "red" } , action) => {
    switch (action.type) {
      case "changeTheme":
        return {
          ...state,
          primary: action.primary
        };
  
      default:
        return state;
    }
  };

export default themeReducer;
