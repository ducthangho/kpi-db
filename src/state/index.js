import React, { createContext, useContext, useReducer } from 'react';
import { decorate, observable, computed, action } from 'mobx'
import PropTypes from 'prop-types';
import  {service, Report, Page, IEmbedConfiguration } from 'powerbi-client';
import { useObservable } from "mobx-react-lite"
import intl from 'react-intl-universal';


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

export class PBIStore {
  store = 
  {
    powerbi : null,
    config : {},
    qnaConfig : {},
    report : null,
    reportQNA : null,
    currentPage : null,
    pages : [],
    error : "",
    loaded : false
  }

  searchDrawer = {
    visible: false,
  }

  locales = {
    obj: intl,
    initDone: false
  }

  tabs = {
    activeKey : null,
    panes: [],
  }

  saveIntl = (intl) => {
    this.locales.obj = intl;
    this.locales.initDone = true;
  }

  addTab = (tab) => {
    this.tabs.panes.push(tab);
  }

  setActiveKey = (key) => {
    this.tabs.activeKey = key;
  }
  
  isLoaded = () => {
    return this.store.loaded;
  }

  getStore = () => {
    return store;
  }

  setError = (err) => {
    this.store.loaded = true;
    this.store.error = err;
  }

  toggleLoaded() {
    this.store.loaded = !this.store.loaded;
  }

  saveEmbed = (pbi,config, rp) => {
    this.store.powerbi = pbi;
    this.store.config = config;    
    this.store.report = rp;
    this.store.loaded = true;
  }

  saveEmbedQNA= (pbi,configQNA, rp) => {
    this.store.powerbi = pbi;
    this.store.qnaConfig = configQNA;    
    this.store.reportQNA = rp;
    this.store.loaded = true;
  }

  saveEmbedQNAConfig = (cfg) => {
    this.store.qnaConfig = cfg;    
  }

  clearPages(){
    this.store.pages.length = 0;
  } 

  addPage = (page) => {
    console.log(page.name + " - " + page.displayName);
    this.store.pages.push(page);
  }

  setCurrentPage = (page) => {
    this.store.currentPage = page;
  }

  getPages = () => {
    return this.store.pages;
  }

  showSearchDrawer = () => {
    this.searchDrawer.visible = true;
  }

  hideSearchDrawer = () => {
    this.searchDrawer.visible = false;
  }
}

decorate(PBIStore, {
  store: observable,
  searchDrawer: observable,   
  locales: observable,
  saveIntl: action,
  setError: action,
  saveEmbed: action,
  toggleLoaded: action,
  clearPages: action,
  addPage: action,
  setCurrentPage: action,
  saveEmbedQNA: action,
  addTab: action,
  setActiveKey: action,
  showSearchDrawer: action,
  hideSearchDrawer: action
})

var Store = createContext(new PBIStore());
export const getStore = () => Store;

