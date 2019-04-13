import React, { useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";
// import { injectGlobal, ThemeProvider } from "styled-components";
import { StateProvider, getStore } from "../state";
import reducers from "../reducers";
import { MainPage } from "components";

import { observable } from "mobx";
import intl from "react-intl-universal";

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

// export default App
const initialState = {
  theme: { primary: "green" },
  popover: { visible: false },
  dashboard: {
    showDrawer: false,
    loaded: false,
    currentPage: {
      id: 1,
      name: "Test page 1"
    },
    showColor: false
  }
};

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
