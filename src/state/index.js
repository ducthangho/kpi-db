import React, { createContext, useContext, useReducer } from "react";
import { decorate, observable, computed, action } from "mobx";
import PropTypes from "prop-types";
import { service, Report, Page, IEmbedConfiguration } from "powerbi-client";
import { useObservable } from "mobx-react-lite";
import intl from "react-intl-universal";
import IntlPolyfill from "intl";
global.Intl = IntlPolyfill;

require("intl/locale-data/jsonp/en-US.js");
require("intl/locale-data/jsonp/vi-VN.js");
require("intl/locale-data/jsonp/ja-JP.js");

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
    loaded: false
  };

  title = observable.box("");
  titleKey = observable.box("GENERAL_INFO");

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

  tabs = {
    activeKey: null,
    panes: []
  };

  changeLanguage = lang => {
    let l = !lang || !this.locales.initDone ? currentLocale : lang;
    if (!l) l = "vi-VN";
    if (!this.locales.initDone || this.locales.lang != l) {
      console.log("Change language to ", l);
      this.locales.lang.set(l);
      this.locales.initDone = true;
      this.locales.obj.init({
        currentLocale: l,
        locales: locales
      });
      let key = this.titleKey.get();
      if (key) {
        console.log("Saved key is ", key);
        let tit = this.locales.obj.get(key);
        console.log("Replacing title to ", tit);
        this.title.set(tit);
      }
    }
  };

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

  setActiveKey = key => {
    this.tabs.activeKey = key;
  };

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
  changeLanguage: action,
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
  setActiveKey: action,
  showSearchDrawer: action,
  hideSearchDrawer: action
});

var Store = createContext(new PBIStore());
export const getStore = () => Store;
