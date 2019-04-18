import React, { Children, useContext, useState, useEffect } from "react";
import styled, { css,injectGlobal } from "styled-components";

import { MainSidebar, MainHeader } from "components";

import {
  Layout,
  Drawer,
  Card,
  Divider,
  Popover,
  Tabs,
  Modal,
  Button
} from "antd";
const { Meta } = Card;
const TabPane = Tabs.TabPane;

import "antd/dist/antd.css";

const { Content } = Layout;
import { getState, getStore } from "state";

import { observer, Observer } from "mobx-react-lite";


const PBIStore = getStore();

// injectGlobal`
// ant-tabs {
//   font-color: yellow !important;
//   color: yellow !important;

// }
// ant-tabs:hover {
//     background-color: #78bdb8;
// }
// `

const StyledTabPane = styled(TabPane)`
:hover {
  font-color: yellow !important;
  color: yellow !important;
  background-color: #21224d;
}
`

const StyledTabs = styled(Tabs)`
:hover {
  font-color: yellow !important;
  color: yellow !important;
  background-color: yellow !important;
}
`

const PageTemplate = observer( props => {
  const [{ dashboard, popover, theme }, dispatch] = getState();
  const store = useContext(PBIStore);
  const [visible, setVisible] = useState(false);
  const tabPanes = [{title : 'Report Tab',key: 'Report',content:<Content>{props.children}</Content>}]
  const [firstTime,setFirstTime] = useState(true);
  const [newTabIndex,setNewTabIndex] = useState(1);

  const onChange = activeKey => {
    console.log("OnChange ",activeKey );
    store.setActiveKey(activeKey);
  };

  const onEdit = (targetKey, action) => {
    console.log("Action ", action);
    console.log("Target ", targetKey);
    if (action=='remove') 
      store.removeTab(targetKey);
    else if (action=='add')
      add();
  };  

  // useEffect(() => {
  //   // var qst = dashboard.searchText;
  //   // if (qst !== undefined && qst !== "")
  //   // loadQNA("");
  //   console.log('HEHEHE');
  // });

  // state = {
  //   visible: false,
  // }

  // hide = () => {
  //   this.setState({
  //     visible: false,
  //   });
  // }

  // handleVisibleChange = (visible) => {
  //   this.setState({ visible });
  // }

  // <Drawer
  //      title="Search Panel"
  //      placement="top"
  //      closable={true}
  //      visible={false}
  //      onClose={() =>
  //        dispatch({
  //          type: "toggleDrawer",
  //          showDrawer: false
  //        })
  //      }
  //      visible={dashboard.showDrawer}
  //      width="1200px"
  //      height="800px"
  //    >
  //    <div id="search-panel" style={{height:"700px", width:"1300px"}}> </div>
  //    </Drawer>

  // <Tabs
  //        hideAdd
  //        onChange={onChange}
  //        activeKey={store.tabs.activeKey}
  //        type="editable-card"
  //        onEdit={onEdit}
  //      >
  //        <Observer tab="" render={ () => store.tabs.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}
  //          <div id="search-panel" style={{height:"700px", width:"1300px"}}> </div>
  //          </TabPane>)}>
  //        </Observer>
  //      </Tabs>
  // <Drawer
  //      title="Search Panel"
  //      placement="top"
  //      closable={true}
  //      onClose={() =>
  //        dispatch({
  //          type: "toggleDrawer",
  //          showDrawer: false
  //        })
  //      }
  //      visible={dashboard.showDrawer}
  //      width="1200px"
  //      height="720px"
  //    >
  // </Drawer>


  if (firstTime) {
    console.log('Add Tab ',firstTime)
    let tab = tabPanes[0];
    let stabPanes = store.tabPanes;

    let found = false;
    for (let i=0;i<stabPanes.length;++i){
      let tb = stabPanes[i];
      if (tb.key==tab.key) {
        found=true;
        break;
      }
    }

    if (!found){
      store.addTab(tab);
      store.setActiveKey(tab.key);      
      console.log('TAB PANE ',stabPanes);
    }
    setFirstTime(false);
  }

  return (
    <Layout>
      <MainSidebar lang={store.language} />
      <Layout style={{ background: "#eee", padding: 0 }}>
        <MainHeader />
        <StyledTabs
          hideAdd
          onChange={onChange}          
          type="line"
          size="default"    
          tabPosition="bottom"
          tabBarGutter={0}          
          activeKey={store.activeTabKey}
          tabBarStyle={{height: "5vh",margin:0,padding:0, color:"white",backgroundColor: "#21224d"}}
        >

        {store.tabPanes.map(pane => <StyledTabPane className="ant-tabs" tab={pane.title} key={pane.key}>{pane.content}</StyledTabPane>)}        
                  
        </StyledTabs>
      </Layout>
    </Layout>
  );
});

PageTemplate.propTypes = {};

export default PageTemplate;
