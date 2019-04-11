import React,{ useEffect} from "react";
import intl from 'react-intl-universal';
import { Switch, Route } from "react-router-dom";
// import { injectGlobal, ThemeProvider } from "styled-components";
import { StateProvider } from "../state";
import reducers from "../reducers";
import { MainPage } from "components";
import IntlPolyfill from "intl";
import { observable } from 'mobx'

// For Node.js, common locales should be added in the application
global.Intl = IntlPolyfill;
require('intl/locale-data/jsonp/en.js');
require('intl/locale-data/jsonp/vi.js');
require('intl/locale-data/jsonp/ja.js');

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


const getCurrentLocale = () => {
  const currentLocale = intl.determineLocale({ urlLocaleKey: "lang", cookieLocaleKey: "lang" });
  const checkedLocale = SUPPOER_LOCALES.filter(locale => currentLocale == locale.value);
  if (checkedLocale.length > 0)
    return currentLocale;
  else
    location.search = `?lang=${SUPPOER_LOCALES[0].value}`;
};



const App = () => {

  useEffect(() => {
    // const currentLocale = SUPPOER_LOCALES[0].value; // Determine user's locale here
    // const currentLocale = intl.determineLocale({ urlLocaleKey: "lang", cookieLocaleKey: "lang" });
    const currentLocale = getCurrentLocale();
    console.log(currentLocale);
      intl.init({
        currentLocale,
        locales: {
          [currentLocale]: require(`./locales/${currentLocale}`)
        }
    });
  })


  return (
    <StateProvider initialState={initialState} reducer={reducers}>
      <Switch>
        <Route path="/" component={MainPage} exact />
      </Switch>
    </StateProvider>
  );
};

export default App;
