import React, { createContext, useContext, useReducer } from 'react';
import { decorate, observable, computed, action } from 'mobx'
import PropTypes from 'prop-types';
import  {service, Report, Page, IEmbedConfiguration } from 'powerbi-client';
import { useObservable } from "mobx-react-lite"


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
    report : null,
    currentPage : null,
    pages : [],
    error : "",
    loaded : false
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

  clearPages(){
    this.pages.length = 0;
  } 

  addPage = (page) => {
    this.pages.push(page);
  }
}

decorate(PBIStore, {
  store: observable,  
  setError: action,
  saveEmbed: action,
  toggleLoaded: action,
  clearPages: action,
  addPage: action

})

export const getStore = () => createContext(new PBIStore())
