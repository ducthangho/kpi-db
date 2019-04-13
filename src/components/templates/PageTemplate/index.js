import React, { Children, useContext, useState, useEffect } from "react";
import styled, { css } from "styled-components";

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

import "antd/dist/antd.css";

const { Content } = Layout;
import { getState, getStore } from "state";

import { observer, Observer } from "mobx-react-lite";

import pbi, { models } from "powerbi-client";

import jsonp from "jsonp";

const PBIStore = getStore();

const powerbi = new pbi.service.Service(
  pbi.factories.hpmFactory,
  pbi.factories.wpmpFactory,
  pbi.factories.routerFactory
);

const reportId = "3f558192-1d40-4d12-949d-7176f5fe3310";
const groupId = "2a396477-75a8-40b2-b8ed-2bf8b8bd5d71";
const datasetId = "6f15a837-92de-48ab-ad42-29de5aa0e691";

const getEmbedToken =
  "https://getembedfuncapp.azurewebsites.net/api/HttpTrigger2?code=XTrzakL7nP2LfGXa53fwYxRNkiXVxJk9tHXAFnC7AmJDun63KO3zcg==";

const PageTemplate = observer(props => {
  const [{ dashboard, popover, theme }, dispatch] = getState();
  const store = useContext(PBIStore);
  const [visible, setVisible] = useState(false);
  var question = "";

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const onChange = activeKey => {
    console.log("OnChange");
  };

  const onEdit = (targetKey, action) => {
    console.log("Action ", action);
    console.log("Target ", targetKey);
    this[action](targetKey);
  };

  const loadQNA = qst => {
    question = qst;
    console.log("loadQNA");
    console.log("Question: " + question);
    updateToken(groupId, datasetId);
  };

  const updateToken = (groupId, datasetId) => {
    // Generate new EmbedToken
    const url =
      getEmbedToken + "&datasetId=" + datasetId + "&groupId=" + groupId;
    jsonp(
      url,
      {
        name: "callback"
      },
      (error, json) => {
        if (error) {
          if (DEBUG) console.log("Error " + error);
          store.setError(error);
        } else {
          //if (DEBUG) console.log('Here ---- '+json);
          //var models = window['powerbi-client'].models;
          //this.updateState(this.props);
          // const obj = (this.status===null || this.status.length===0) ? null : JSON.parse(this.status);
          //console.log('JSON = ',json);

          var configQNA = {
            type: "qna",
            isLoaded: true,
            width: 800,
            height: 800,
            tokenType: models.TokenType.Embed,
            accessToken: json.EmbedToken,
            embedUrl: json.EmbedUrl,
            datasetIds: [datasetId],
            viewMode: models.QnaMode.Interactive,
            question: question
          };

          // updateState(config);
          //const errors = validateConfig(config);
          //if (!errors) {
          store.saveEmbedQNAConfig(configQNA);
          embedQNA(configQNA);
          //} else console.log(errors);

          //if (DEBUG) console.log('Result = '+ JSON.stringify(obj));
          //this.status = obj;
        }
      }
    );
  };

  const embedQNA = configQNA => {
    var panel = document.getElementById("search-panel");

    let qna = powerbi.embed(panel, configQNA);
    console.log("store.saveEmbed(powerbi,config,report);");
    store.saveEmbedQNA(powerbi, configQNA, qna);
    // qna.off removes a given event listener if it exists.
    qna.off("visualRendered");

    // qna.on will add an event listener.
    qna.on("visualRendered", function(event) {
      console.log(event.detail);
    });
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

  return (
    <Layout>
      <MainSidebar lang={store.language} />
      <Layout style={{ background: "#eee", padding: 0 }}>
        <MainHeader />
        <Content>{props.children}</Content>
      </Layout>
    </Layout>
  );
});

PageTemplate.propTypes = {};

export default PageTemplate;
