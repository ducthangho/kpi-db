import React, {
    useReducer,
    useEffect,
    useState,
    Fragment,
    useContext,
    useRef
} from "react";
import PropTypes from "prop-types";
import {
    getState,
    getStore
} from "../../../state";
import {
    Row,
    Col,
    Card,
    Layout
} from "antd";
import {
    observer,
    useDisposable
} from 'mobx-react-lite';
import * as mobx from "mobx";
import $ from 'jquery';
import jsonp from 'jsonp';
import {
    fromEvent
} from 'rxjs';
import pbi, {
    models
} from 'powerbi-client';
import {
    debounceTime
} from 'rxjs/operators';
import root from 'window-or-global'

const {
    Content
} = Layout;
// const right1 = (
//   <Col span={18} style={{ height: "calc(100vh - 100xp)", padding: "10px" }}>
//     {viewContent["cesium"]}
//   </Col>
// );

const PBIStore = getStore();
const PAGEVIEW = 'fitToWidth';
const DEBUG = true;
const W = "100%";
const H = "800";
const powerbi = new pbi.service.Service(
    pbi.factories.hpmFactory,
    pbi.factories.wpmpFactory,
    pbi.factories.routerFactory)
// const reportURL = "https://app.powerbi.com/reportEmbed?reportId=037d51e1-7d74-48ac-b066-389ddb9796b1&groupId=2a396477-75a8-40b2-b8ed-2bf8b8bd5d71&autoAuth=true&ctid=70fc4985-a127-466f-ab2a-8dac100b682b";
// const reportID = "5b65576a-3027-4c09-9270-2992c709b379";
// const groupID = "2a396477-75a8-40b2-b8ed-2bf8b8bd5d71";
const reportURL = "https://app.powerbi.com/reportEmbed?reportId=e24a387d-3a3f-496a-bbe8-57bea4d19d7f&groupId=2a396477-75a8-40b2-b8ed-2bf8b8bd5d71&autoAuth=true&ctid=70fc4985-a127-466f-ab2a-8dac100b682b";
const reportID = "e24a387d-3a3f-496a-bbe8-57bea4d19d7f";
const groupID = "2a396477-75a8-40b2-b8ed-2bf8b8bd5d71";
const datasetID ="6f15a837-92de-48ab-ad42-29de5aa0e691"

const getEmbedToken = "https://getembedfuncapp.azurewebsites.net/api/HttpTrigger1?code=MWakS6g9stuWnb1syRFdjqWDUZvmyYIYg3JeYFp23IUd6J/9jRTaSQ==&reportID=" + reportID + "&groupId=" + groupID;
const source = fromEvent(root, 'resize');

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
            height: dimension.current.height,
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


    const embed = (config) => { 
      let report = powerbi.embed(rootElement.current, config);
      console.log('store.saveEmbed(powerbi,config,report);');
      store.saveEmbed(powerbi, config, report);
      report.setAccessToken(config.accessToken)
          .then(() => {
              // Set token expiration listener
              // result.expiration is in ISO format
              setTokenExpirationListener(json.Ellapse, 2 /*minutes before expiration*/ );
          });
      const height = rootElement.current.clientHeight;
      const width = rootElement.current.clientWidth;   
      performOnEmbed(report, { height, width });
      if (props.onEmbedded) {
        props.onEmbedded(report, { height, width });
      }     
    }

    const embedQNA = (configQNA) => {
      var panel = document.getElementById("search-panel");
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

    

    const updateToken = (reportId, groupId) => {
        // Generate new EmbedToken
        const url = "https://getembedfuncapp.azurewebsites.net/api/HttpTrigger1?code=MWakS6g9stuWnb1syRFdjqWDUZvmyYIYg3JeYFp23IUd6J/9jRTaSQ==&reportID=" + reportId + "&groupId=" + groupId;
        jsonp(url, {
            name: 'callback'
        }, (error, json) => {
            if (error) {
                if (DEBUG) console.log('Error ' + error);
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
                    pageView: PAGEVIEW
                });

                 var configQNA= {
                    type: 'qna',
                    isLoaded: true,
                    width: 800,
                    height: 800,
                    tokenType: models.TokenType.Embed,
                    accessToken: json.EmbedToken,
                    embedUrl: json.EmbedUrl,
                    datasetIds: [datasetID],
                    viewMode: models.QnaMode.Interactive,
                    question: ""
                };

                // updateState(config);
                const errors = validateConfig(config);
                if (!errors) {
                    embed(config);
                    store.saveEmbedQNAConfig(configQNA);
                } else if (store.report !== null) {
                    reset();
                } else console.log(errors);



                //if (DEBUG) console.log('Result = '+ JSON.stringify(obj));
                //this.status = obj;
            }
        });
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
        if (timeout <= 0) {
            console.log("Updating Report Embed Token");
            updateToken(reportId, groupId);
        }
        // set timeout so minutesToRefresh minutes before token expires, token will be updated
        else {
            console.log("Report Embed Token will be updated in " + timeout + " milliseconds.");
            // setTimeout(() => {
            //   this.updateToken(reportId, groupId);
            // }, timeout);
        }
    }

    const updateWindowDimensions = () => {
        console.log('updateWindowDimensions');
        if (store.isLoaded()) reset();
        updateToken(reportID, groupID);
    }

    const performOnEmbed = (report, dimensions) => {
    
      const {
        embedType,
        onLoad,
        onSelectData,
        onPageChange,
        onTileClicked,
      } = props;
      //if (DEBUG) console.log('performOnEmbed ',embedType,report,onLoad,onSelectData,onPageChange,onTileClicked);
      if(embedType === 'report') {
        //if (DEBUG) console.log("Registering event handlers...");

        report.off("rendered");
        report.on('rendered', () => {
          //window.alert("rendered EVENT");
          console.log('rendered');

          report.getPages()
            .then(function (pages) {

              if (pages.length > 0) {
                const firstPage = pages[0];
                firstPage.isActive = true;              
                store.setCurrentPage(firstPage);
                pages.forEach(function (page){
                  store.addPage(page);        
                });                         
              };
                    
              if (onLoad) onLoad(report, dimensions);
            });
        });


        // Report.off removes a given event handler if it exists.
        report.off("loaded");        
        report.on('loaded', () => {
            
            // var expiration = report.config.expiration;
            // console.log(expiration+"   ;   "+report.config.id+"    ;   "+report.config.groupId);
            var ellapse = report.config.ellapse;
            setTokenExpirationListener(ellapse,
              2 /*minutes before expiration*/, 
              report.config.id, 
              report.config.groupId);          

            if (onLoad) onLoad(report, dimensions);


            });

        report.on("error", function(event) {
            // Log.log(event.detail);
            console.log(event.detail);
            alert(event.detail.detailedMessage);
            report.off("error");
        });

        report.off('dataSelected');
        report.on('dataSelected', (event) => {
          if (onSelectData) { onSelectData(event.detail); }
        });

        report.off('pageChanged');
        report.on('pageChanged', (event) => {
          if (onPageChange) { onPageChange(event.detail); }
        });


        //if (DEBUG) console.log("Registering event handlers finished ...",rp);
      } else if(embedType === 'dashboard'){
        report.off('tileClicked');
        report.on('tileClicked', (event) => {
          if (onTileClicked) { onTileClicked(report, event.detail); }
        });
      }
    }

 

    useEffect(() => {

        savedHandler.current = source.pipe(debounceTime(1500)).subscribe(updateWindowDimensions);
        let h = (props.height) ? props.height : $(window).height();
        let rect = rootElement.current.getBoundingClientRect();
        let top = rect.top + window.scrollY;
        let height = (h - 1.1*(top-h)) + 'px';
        dimension.current = {
                height: height
            }
            // var subscription = source.pipe(debounceTime(1500)).subscribe(updateWindowDimensions);
        rootElement.current.style.height = height;
        updateToken(reportID, groupID);
        console.log('HH = ', h, top);


        //Unsubscribe on clean up  
        return () => {
            console.log('Cleaning up');
            savedHandler.current.unsubscribe();
        }
    });

    return ( <
        div id = "PBI"
        className = "App"
        ref = {
            rootElement
        }
        >
        <
        h2 > A Todo App yet again! < /h2>       <
        /div>
    )
})



const TestScreen = props => {
    const [columWidth, setColumnWidth] = useState({
        left: 6,
        right: 18,
        rightContent: < div > No info < /div>,
        leftContent: < div > No info < /div>
    });
    const [bgColor, setbgColor] = useState("white");
    const [{
        dashboard,
        theme
    }, dispatch] = getState();

    useEffect(() => {
        if (dashboard.showColor) {
            setbgColor(theme.primary);
        } else {
            setbgColor("white");
        }
    }, [dashboard.showColor]);

    return ( 
        
        <PBIScreen embedType="report"/> 
        
    );
};

TestScreen.propTypes = {};

export default TestScreen;