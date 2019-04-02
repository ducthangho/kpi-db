import React from "react";
import { Switch, Route } from "react-router-dom";
// import { injectGlobal, ThemeProvider } from "styled-components";
import { StateProvider } from "../state";
import reducers from "../reducers";
import { MainPage } from "components";

// https://github.com/diegohaz/arc/wiki/Styling
// import theme from './themes/default'

// injectGlobal`
//   body {
//     margin: 0;
//   }
// `

// const App = () => {
//   return (
//     <ThemeProvider theme={theme}>
//       <Switch>
//         <Route path="/" component={HomePage} exact />
//       </Switch>
//     </ThemeProvider>
//   )
// }

// export default App
const initialState = {
  theme: { primary: "green" },
  dashboard: {
    showDrawer: false,
    currentPage: {
      id: 1,
      name: "Test page 1"
    },
    showColor:false
  }
};

const App = () => {
  return (
    <StateProvider initialState={initialState} reducer={reducers}>
      <Switch>
        <Route path="/" component={MainPage} exact />
      </Switch>
    </StateProvider>
  );
};

export default App;
