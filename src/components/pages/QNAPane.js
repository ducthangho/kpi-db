import React, { Children, useContext, useState, useEffect, useRef } from "react";
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

const W = "100%";
const H = "90vh";

const getEmbedToken =
  "https://getembedfuncapp.azurewebsites.net/api/HttpTrigger2?code=XTrzakL7nP2LfGXa53fwYxRNkiXVxJk9tHXAFnC7AmJDun63KO3zcg==";



const QNAPane = observer( props => {
  var question = "";
  const store = useContext(getStore());
  const searchRef = useRef(null);

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };
  

  const loadQNA = panel => {
    // question = qst;
    console.log("loadQNA");
    console.log("Question: " + question);
    updateToken(panel,groupId, datasetId);
  };

    const add = () => {
    // const panes = store.tabs.panes;
    // const activeKey = "newTab"+newTabIndex;
    // setNewTabIndex(newTabIndex+1);
    // const dim = store.dimension;
    // panes.push({ title: 'Search Tab '+ newTabIndex, content: <div id={activeKey+"_panel"} 
    // style= {{ display:"block", "min-width":"100%", "min-height":"800px" }}> New Tab Content</div>, key: activeKey });
    // store.addTab({ activeKey, panes });
  }
  

  const updateToken = (panel, groupId, datasetId) => {
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
            width: W,
            height: H,
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
          embedQNA(panel,configQNA);
          //} else console.log(errors);

          //if (DEBUG) console.log('Result = '+ JSON.stringify(obj));
          //this.status = obj;
        }
      }
    );
  };

  const embedQNA = (panel, configQNA) => {
    // var panel = document.getElementById("search-panel");
    if (!panel) return;
    let qna = powerbi.embed(panel, configQNA);
    console.log("store.saveEmbed(powerbi,config,report);");
    store.saveEmbedQNA(powerbi, configQNA, qna);
    // qna.off removes a given event listener if it exists.
    qna.off("visualRendered");

    // qna.on will add an event listener.
    qna.on("visualRendered", function(event) {
      console.log(event.detail);
    });
    
  };

  useEffect(() => {
    console.log('EMBEDDING QNAPane ',searchRef.current);
    if (searchRef.current) loadQNA(searchRef.current);
  } )

  return (
    <div ref={searchRef} style={{width : W, height: H}}> New Tab Content</div>
  )

})

export default QNAPane;