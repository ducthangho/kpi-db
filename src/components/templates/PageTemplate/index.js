import React, { Children,useContext, useState } from "react";
import styled, { css } from "styled-components";

import { MainSidebar, MainHeader } from "components";

import { Layout, Drawer, Card, Divider, Popover, Tabs } from "antd";
const { Meta } = Card;

import "antd/dist/antd.css";

const { Content } = Layout;
import { getState,getStore } from "../../../state";

import {
    observer,Observer    
} from 'mobx-react-lite';


const PBIStore = getStore();

const PageTemplate = observer( props => {
  const [{ dashboard,popover, theme }, dispatch] = getState();
  const store = useContext(PBIStore);
  
  const onChange = (activeKey) => {
    console.log('OnChange');
  }

  const onEdit = (targetKey, action) => {
    console.log('Action ',action);
    console.log('Target ',targetKey);
    this[action](targetKey);
  }



  const embedQNA = () => {
      var panel = document.getElementById("search-panel");
      var powerbi = store.store.powerbi;
      var configQNA = store.store.qnaConfig;
      let qna = powerbi.embed(panel, configQNA);
      console.log('store.saveEmbed(powerbi,config,report);');
      store.saveEmbedQNA(powerbi, configQNA, qna);
      // qna.off removes a given event listener if it exists.
      qna.off("visualRendered");

      // qna.on will add an event listener.
      qna.on("visualRendered", function(event) {
            console.log(event.detail);
      })
      // report.setAccessToken(configQNA.accessToken)
      //     .then(() => {
      //         // Set token expiration listener
      //         // result.expiration is in ISO format
      //         setTokenExpirationListener(json.Ellapse, 2 /*minutes before expiration*/ );
      //     });
      // const height = rootElement.current.clientHeight;
      // const width = rootElement.current.clientWidth;   
      // performOnEmbed(report, { height, width });
      // if (props.onEmbedded) {
      //   props.onEmbedded(report, { height, width });
      // }     
  }


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

   return (
    <Layout>
      <MainSidebar />
      <Layout style={{ background: "#eee", padding: 0 }}>
        <MainHeader />        
        <Content>{props.children}</Content>
          <Drawer
            title="Search Panel"
            placement="top"
            closable={true}
            onClose={() => store.hideSearchDrawer()
            }
            visible={store.searchDrawer.visible}
            width="1200px"
            height="800px"
          >
          <div id="search-panel" style={{height:"700px", width:"1300px"}}> </div>
          </Drawer>     
        </Layout>
      </Layout>   
  );
});

PageTemplate.propTypes = {};

export default PageTemplate;
