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
  //   <PageTemplate key={store.activeTabKey}>
  //   <TestScreen/>
  // </PageTemplate>
  return (
  <PageTemplate>
  <TestScreen/>
</PageTemplate>
  )
}

export default MainPage
