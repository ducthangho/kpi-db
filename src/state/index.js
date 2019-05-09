import React, { createContext, useContext, useReducer } from "react";
import { decorate, observable, computed, action } from "mobx";
import PropTypes from "prop-types";
import { service, Report, Page, IEmbedConfiguration } from "powerbi-client";
import { useObservable } from "mobx-react-lite";
import intl from "react-intl-universal";
import IntlPolyfill from "intl";
global.Intl = IntlPolyfill;

import("intl/locale-data/jsonp/en-US.js");
import("intl/locale-data/jsonp/vi-VN.js");
import("intl/locale-data/jsonp/ja-JP.js");

export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

StateProvider.propTypes = {
  /**
   * @return {React.Node}
   */
  children: PropTypes.node.isRequired,

  /**
   * Object containing initial state value.
   */
  initialState: PropTypes.shape({}).isRequired,

  /**
   *
   * @param {object} state
   * @param {object} action
   */
  reducer: PropTypes.func.isRequired
};

export const getState = () => useContext(StateContext);

const currentLocale = intl.determineLocale({
  urlLocaleKey: "lang",
  cookieLocaleKey: "lang"
});

const locales = {
  "en-US": require("../components/locales/en-US"),
  "vi-VN": require("../components/locales/vi-VN"),
  "ja-JP": require("../components/locales/ja-JP")
};

export class PBIStore {
  store = {
    powerbi: null,
    config: {},
    qnaConfig: {},
    report: null,
    reportQNA: null,
    currentPage: null,
    pages: [],
    bookmarks: [],
    error: "",
    loaded: false,
    dimension: {},
    updateCustomLayout: false,
    rX : -1,
    rY : -1,
    containerW : 0,
    containerH : 0,
  };


  title = observable.box("");
  titleKey = observable.box("GENERAL_INFO");
  firstT = observable.box(true);

  updateRatio = (rx,ry) => {
    this.store.rX = rx;
    this.store.rY = ry;
  }

  setContainerSize = (w,h) => {
    this.store.containerW = w;
    this.store.containerH = h;
  }

  get ContainerSize() {
    return {width : this.store.containerW, height: this.store.containerH}  
  }

  get ratio() {
    return {rX : this.store.rX, rY: this.store.rY}
  }

  searchDrawer = {
    visible: false
  };

  locales = {
    obj: intl,
    lang: observable.box("vi-VN"),
    initDone: false
  };

  get text() {
    return this.locales.obj;
  }

  get pages() {
    return this.store.pages;
  }

  get report() {
    return this.store.report;
  }

  tabs = {
    activeKey: observable.box(""),
    panes: []
  };

  get firstTime(){
    return this.firstT.get();
  }

  setFirstTime = val => {
    this.firstT.set(val);
  }


  changeLanguage = lang => {
    let l = !lang || !this.locales.initDone ? currentLocale : lang;
    if (!l) l = "vi-VN";
    if (!this.locales.initDone || this.locales.lang != l) {
      console.log("Change language to ", l);
      if (l!="vi-VN" && l!="en-US" && l != "ja-JP") l="vi-VN";
      this.locales.lang.set(l);
      this.locales.initDone = true;
      this.locales.obj.init({
        currentLocale: l,
        locales: locales
      }).then( () => {
        let key = this.titleKey.get();
        if (key) {
          console.log("Saved key is ", key);
          let tit = this.locales.obj.get(key);
          console.log("Replacing title to ", tit);
          this.title.set(tit);
        }
      } ).catch((err) => {
        console.log('Caught err ',err);
      });

    }
  };

  get dimension(){
    return this.store.dimension;
  }

  setDimension = (dim) => {
    this.store.dimension = dim;
  }

  get language() {
    return this.locales.lang.get();
  }

  saveTitle = (key, tit) => {
    this.title.set(tit);
    this.titleKey.set(key);
  };

  get TitleKey() {
    return this.titleKey.get();
  }

  restoreTitle = () => {
    let tit = this.locales.obj.get(this.titleKey.get());
    this.title.set(tit);
  };

  get Title() {
    return this.title.get();
  }

  saveIntl = intl => {
    this.locales.obj = intl;
    this.locales.initDone = true;
  };

  addTab = tab => {
    this.tabs.panes.push(tab);
  };

  clearTabPane = () =>{
    this.tabs.panes = [];
    this.tabs.activeKey.set("");
  }

  get activeTabKey(){
    return this.tabs.activeKey.get();
  }

  setActiveKey = key => {
    this.tabs.activeKey.set(key);
  };

  removeTab = targetKey => {
    let activeKey = tabs.activeKey.get();
    let lastIndex;
    this.tabs.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });

    const panes = tabs.panes.filter(pane => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.tabs.panes = panes;
  }

  get tabPanes(){
    return this.tabs.panes;
  }

  isLoaded = () => {
    return this.store.loaded;
  };

  getStore = () => {
    return store;
  };

  setError = err => {
    this.store.loaded = true;
    this.store.error = err;
  };

  toggleLoaded() {
    this.store.loaded = !this.store.loaded;
  }

  saveEmbed = (pbi, config, rp) => {
    this.store.powerbi = pbi;
    this.store.config = config;
    this.store.report = rp;
    this.store.loaded = true;
  };

  saveEmbedQNA = (pbi, configQNA, rp) => {
    this.store.powerbi = pbi;
    this.store.qnaConfig = configQNA;
    this.store.reportQNA = rp;
    this.store.loaded = true;
  };

  saveEmbedQNAConfig = cfg => {
    this.store.qnaConfig = cfg;
  };

  clearPages() {
    this.store.pages.length = 0;
  }

  clearBookmarks() {
    this.store.pages.length = 0;
  }

  addPage = page => {
    // console.log(page.name + " - " + page.displayName);
    this.store.pages.push(page);
  };

  addBookmark = bookmark => {
    // console.log(page.name + " - " + page.displayName);
    this.store.bookmarks.push(bookmark);
  };

  setCurrentPage = page => {
    this.store.currentPage = page;
  };

  getPages = () => {
    return this.store.pages;
  };

  showSearchDrawer = () => {
    this.searchDrawer.visible = true;
  };

  hideSearchDrawer = () => {
    this.searchDrawer.visible = false;
  };
}

decorate(PBIStore, {
  store: observable,
  searchDrawer: observable,
  locales: observable,
  tabs: observable,
  firstT: observable,
  setFirstTime: action,
  updateRatio: action,
  setContainerSize: action,
  changeLanguage: action,
  setDimension: action,
  saveIntl: action,
  saveTitle: action,
  restoreTitle: action,
  setError: action,
  saveEmbed: action,
  toggleLoaded: action,
  clearPages: action,
  clearBookmarks: action,
  addPage: action,
  addBookmark: action,
  setCurrentPage: action,
  saveEmbedQNA: action,
  addTab: action,
  clearTabPane: action,
  setActiveKey: action,
  removeTab: action,
  showSearchDrawer: action,
  hideSearchDrawer: action
});

var Store = createContext(new PBIStore());
export const getStore = () => Store;
