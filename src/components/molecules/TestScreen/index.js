import React, { useReducer, useEffect, useState, Fragment, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { getState, getStore } from "../../../state";
import { Row, Col, Card, Layout } from "antd";
import { observer, useDisposable } from 'mobx-react-lite';
import * as mobx from "mobx";
import $ from 'jquery';
import jsonp from 'jsonp';
import { fromEvent } from 'rxjs';
import pbi, { models } from 'powerbi-client';
import { debounceTime } from 'rxjs/operators';
import root from 'window-or-global'

const { Content } = Layout;
// const right1 = (
//   <Col span={18} style={{ height: "calc(100vh - 100xp)", padding: "10px" }}>
//     {viewContent["cesium"]}
//   </Col>
// );

const PBIStore = getStore();
const PAGEVIEW = 'fitToWidth';
const DEBUG = true;
const W="100%";
const H="800";
const powerbi = new pbi.service.Service(
  pbi.factories.hpmFactory,
  pbi.factories.wpmpFactory,
  pbi.factories.routerFactory)
const reportURL = "https://app.powerbi.com/reportEmbed?reportId=037d51e1-7d74-48ac-b066-389ddb9796b1&groupId=2a396477-75a8-40b2-b8ed-2bf8b8bd5d71&autoAuth=true&ctid=70fc4985-a127-466f-ab2a-8dac100b682b";
const reportID = "5b65576a-3027-4c09-9270-2992c709b379";
const groupID = "2a396477-75a8-40b2-b8ed-2bf8b8bd5d71";
const getEmbedToken = "https://getembedfuncapp.azurewebsites.net/api/HttpTrigger1?code=MWakS6g9stuWnb1syRFdjqWDUZvmyYIYg3JeYFp23IUd6J/9jRTaSQ==&reportID="+reportID+"&groupId="+groupID;
const source = fromEvent(root,'resize');

export const PBIScreen = observer((props) => {


  // const [handler, saveHandler] = useState({
  //   subscription : {} 
  // });
  const store = useContext(PBIStore);
  const rootElement = React.useRef();
  const savedHandler = useRef();
  const dimension = useRef();
  
  // useEffect(() => {
  //   savedHandler.current = source.pipe(debounceTime(1500)).subscribe(updateWindowDimensions);
  // });


  const validateConfig = (config) => {
    switch (config.type) {
      case 'report':
        return models.validateReportLoad(config);
      case 'dashboard':
        return models.validateDashboardLoad(config);
      default:
        return 'Unknown config type';
    }
  };

  const createConfig = (config) => {             
    var rect = rootElement.current.getBoundingClientRect();
    // console.log('rect = ',JSON.stringify(rect));
    // console.log('HEIGHT ',$(window).height()-rect.top);
    // let height = $(window).height()-rect.top;    

    var obj = {
        isLoaded: true,
        pageName: (config && config.pageName) ? config.pageName : undefined,
        width: W,        
        // height: $(window).height()-rect.top,  
        height : dimension.current.height,
        type: 'report',
        id: (config.id) ? (config.id) : reportID,
        embedUrl: (config.embedUrl) ? config.embedUrl : reportURL,
        tokenType: 1, //EMBED = 1, AAD = 0
        accessToken: config.accessToken,
        pageView: PAGEVIEW,
        settings: {
          filterPaneEnabled: false,
          navContentPaneEnabled: false,
          dataSelectedEnabled: true   
        }
    };              
    
    return obj;
  }

  const reset = () => {    
    if (store) {
      // console.log('Resetting ',store);
      let powerbi = store.store.powerbi;
      powerbi.reset(rootElement.current);
    }
    store.report = null;
  }

  const updateToken = (reportId, groupId) => {
    // Generate new EmbedToken
    const url = "https://getembedfuncapp.azurewebsites.net/api/HttpTrigger1?code=MWakS6g9stuWnb1syRFdjqWDUZvmyYIYg3JeYFp23IUd6J/9jRTaSQ==&reportID="+reportId+"&groupId="+groupId;
    jsonp(url,{ name: 'callback'}, (error,json) =>
            {              
              if (error){
                if (DEBUG) console.log('Error '+error);
                store.setError(error);
              } else {
                //if (DEBUG) console.log('Here ---- '+json);
                //var models = window['powerbi-client'].models;                
                //this.updateState(this.props);
                // const obj = (this.status===null || this.status.length===0) ? null : JSON.parse(this.status);                
                //console.log('JSON = ',json);                

                var config = createConfig({
                  isLoaded: true,
                  width: W,
                  height: dimension.current.height,
                  type: 'report',
                  id: json.ReportId,
                  embedUrl: json.EmbedUrl,
                  tokenType: models.TokenType.Embed, //EMBED = 1, AAD = 0
                  accessToken: json.EmbedToken,
                  permissions: models.Permissions.All,
                  expiration: json.Expiry,     
                  ellapse: json.Ellapse,
                  pageView : PAGEVIEW
                });
                    
                // updateState(config);
                const errors = validateConfig(config);
                if (!errors) {
                
                let report = powerbi.embed(rootElement.current, config);
                console.log('store.saveEmbed(powerbi,config,report);');                    
                store.saveEmbed(powerbi,config,report);                
                report.setAccessToken(json.EmbedToken)
                  .then(() => {
                  // Set token expiration listener
                  // result.expiration is in ISO format
                    setTokenExpirationListener(json.Ellapse,2 /*minutes before expiration*/);
                  });
                } else if (store.report !== null) {
                  reset();
                } else console.log(errors);

                
                            
                //if (DEBUG) console.log('Result = '+ JSON.stringify(obj));
                //this.status = obj;
              }
            }
        ).bind(this);  
  }

  const setTokenExpirationListener = (ellapse, 
      minutesToRefresh = 2, 
      reportId, 
      groupId) => {
      // get current time
      
      var safetyInterval = minutesToRefresh;

      // time until token refresh in milliseconds
      var timeout = (ellapse - safetyInterval) * 60 * 1000;      
      // if token already expired, generate new token and set the access token
      if (timeout<=0)
      {
          console.log("Updating Report Embed Token");
          updateToken(reportId, groupId);
      }
      // set timeout so minutesToRefresh minutes before token expires, token will be updated
      else 
      {
          console.log("Report Embed Token will be updated in " + timeout + " milliseconds.");
          // setTimeout(() => {
          //   this.updateToken(reportId, groupId);
          // }, timeout);
      }
  }

  const updateWindowDimensions = () => {    
    console.log('updateWindowDimensions');
    if (store.isLoaded()) reset();
    updateToken(reportID,groupID);
  }

  useEffect( () =>
    { 
      
      savedHandler.current = source.pipe(debounceTime(1500)).subscribe(updateWindowDimensions);
      let h = (props.height) ? props.height : $(window).height();
      let offsetTop = rootElement.current.offsetTop;
      let height = (h - 5*offsetTop) + 'px';
      dimension.current = {height : height}
      // var subscription = source.pipe(debounceTime(1500)).subscribe(updateWindowDimensions);
      updateToken(reportID,groupID);
      // console.log('HH = ',height,offsetTop);
      rootElement.current.style.height = height;

      //Unsubscribe on clean up  
      return () => {
        console.log('Cleaning up');
        savedHandler.current.unsubscribe();
      }
    }
  );

  
  let h = (props.height) ? props.height : $(window).height();
  // let offsetTop = document.getElementById("PBI").offsetTop;
  // let height = (h - offsetTop) + '.px';
  
  return (
    <div id="PBI" className="App" ref={rootElement} style={{height: h + '.px' }}>
      <h2>A Todo App yet again!</h2>      
    </div>
  )
})



const TestScreen = props => {
  const [columWidth, setColumnWidth] = useState({
    left: 6,
    right: 18,
    rightContent: <div>No info</div>,
    leftContent: <div>No info</div>
  });
  const [bgColor, setbgColor] = useState("white");
  const [{ dashboard, theme }, dispatch] = getState();

  useEffect(() => {
    if (dashboard.showColor) {
      setbgColor(theme.primary);
    } else {
      setbgColor("white");
    }
  }, [dashboard.showColor]);

  return (
    <Content
      style={{
        margin: 10,
        padding: 0,
        background: "#fff",          
      }}
    >
      <Row>
        <Col
          
          style={{            
            padding: 10,
          }}
        >
          {dashboard.searchText}
        </Col>

        <Col          
          style={{            
            padding: 10,
            backgroundColor: bgColor,
          }}
        >
          <PBIScreen height={$(window).height()}/>
        </Col>
      </Row>
    </Content>
  );
};

TestScreen.propTypes = {};

export default TestScreen;

