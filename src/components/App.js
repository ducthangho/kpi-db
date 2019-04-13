import React,{ useEffect, useContext} from "react";
import { Switch, Route } from "react-router-dom";
// import { injectGlobal, ThemeProvider } from "styled-components";
import { StateProvider,getStore } from "../state";
import reducers from "../reducers";
import { MainPage } from "components";

import { observable } from 'mobx'
import intl from 'react-intl-universal';

// For Node.js, common locales should be added in the application

const SUPPOER_LOCALES = [
  {
    name: "English",
    value: "en-US"
  },
  {
    name: "Tiếng Việt",
    value: "vi-VN"
  },
  {
    name: "日本の",
    value: "ja-JP"
  }
];

const PBIStore = getStore();

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
  popover : {visible: false},
  dashboard: {
    showDrawer: false,
    loaded: false,
    currentPage: {
      id: 1,
      name: "Test page 1"
    },
    showColor:false
  }
};


// const getCurrentLocale = () => {
//   const currentLocale = intl.determineLocale({ urlLocaleKey: "lang", cookieLocaleKey: "lang" });
//   const checkedLocale = SUPPOER_LOCALES.filter(locale => currentLocale == locale.value);
//   if (checkedLocale.length > 0)
//     return currentLocale;
//   else
//     location.search = `?lang=${SUPPOER_LOCALES[0].value}`;
// };



const App = () => {

  const store = useContext(PBIStore);    
  


  return (
    <StateProvider initialState={initialState} reducer={reducers}>
      <Switch>
        <Route path="/" component={MainPage} exact />
      </Switch>
    </StateProvider>
  );
};

export default App;
