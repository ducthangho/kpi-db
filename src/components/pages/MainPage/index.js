import React,{  useContext } from "react";
import { getStore } from 'state';
// import { observable } from "mobx";

import {
  TestScreen,
  PageTemplate
} from 'components'

const PBIStore = getStore();

function MainPage() {
  const store = useContext(PBIStore);

  return (
    <PageTemplate key={store.activeTabKey}>
    <TestScreen/>
  </PageTemplate>
  )
}

export default MainPage
