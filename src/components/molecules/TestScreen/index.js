import React, {
    useReducer,
    useEffect,
    useLayoutEffect,
    useState,
    Fragment,
    useContext,
    useRef
} from "react";
import PropTypes from "prop-types";
import {
    getState,
    getStore
} from "state";
import {
    Row,
    Col,
    Card,
    Layout
} from "antd";
import {
    observer,
    useDisposable
} from "mobx-react-lite";
import * as mobx from "mobx";
import $ from "jquery";
import jsonp from "jsonp";
import {
    fromEvent
} from "rxjs";
import pbi, {
    models
} from "powerbi-client";
import {
    debounceTime
} from "rxjs/operators";
import root from "window-or-global";

const {
    Content
} = Layout;
// const right1 = (
//   <Col span={18} style={{ height: "calc(100vh - 100xp)", padding: "10px" }}>
//     {viewContent["cesium"]}
//   </Col>
// );

const PBIStore = getStore();
const PAGEVIEW = "fitToWidth";
const DEBUG = true;
const W = "100%";
const H = "90vh";
const powerbi = new pbi.service.Service(
    pbi.factories.hpmFactory,
    pbi.factories.wpmpFactory,
    pbi.factories.routerFactory
);
// const reportURL = "https://app.powerbi.com/reportEmbed?reportId=037d51e1-7d74-48ac-b066-389ddb9796b1&groupId=2a396477-75a8-40b2-b8ed-2bf8b8bd5d71&autoAuth=true&ctid=70fc4985-a127-466f-ab2a-8dac100b682b";
// const reportID = "5b65576a-3027-4c09-9270-2992c709b379";
// const groupID = "2a396477-75a8-40b2-b8ed-2bf8b8bd5d71";
const reportURL =
    "https://app.powerbi.com/reportEmbed?reportId=3f558192-1d40-4d12-949d-7176f5fe3310&groupId=2a396477-75a8-40b2-b8ed-2bf8b8bd5d71&autoAuth=true&ctid=70fc4985-a127-466f-ab2a-8dac100b682b";
const reportID = "709a9eab-d8f6-4a65-bfb4-c7c49c46c50e";
const groupID = "2a396477-75a8-40b2-b8ed-2bf8b8bd5d71";
const datasetID = "6f15a837-92de-48ab-ad42-29de5aa0e691";

const getEmbedToken =
    "https://getembedfuncapp.azurewebsites.net/api/HttpTrigger1?code=MWakS6g9stuWnb1syRFdjqWDUZvmyYIYg3JeYFp23IUd6J/9jRTaSQ==&reportID=" +
    reportID +
    "&groupId=" +
    groupID;
const source = fromEvent(root, "resize");

export const PBIScreen = observer(props => {
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

    const validateConfig = config => {
        switch (config.type) {
            case "report":
                return models.validateReportLoad(config);
            case "dashboard":
                return models.validateDashboardLoad(config);
            default:
                return "Unknown config type";
        }
    };

    const createConfig = config => {
        var rect = rootElement.current.getBoundingClientRect();
        // console.log('rect = ',JSON.stringify(rect));
        // console.log('HEIGHT ',$(window).height()-rect.top);
        // let height = $(window).height()-rect.top;

        var obj = {
            isLoaded: true,
            pageName: config && config.pageName ? config.pageName : undefined,
            width: W,
            // height: $(window).height()-rect.top,
            // height: dimension.current.height,
            height: H,
            type: "report",
            id: config.id ? config.id : reportID,
            embedUrl: config.embedUrl ? config.embedUrl : reportURL,
            tokenType: 1, //EMBED = 1, AAD = 0
            accessToken: config.accessToken,
            expiration: config.expiration,
            ellapse: config.ellapse,
            pageView: PAGEVIEW,
            settings: {
                filterPaneEnabled: false,
                navContentPaneEnabled: false,
                dataSelectedEnabled: true
            }
        };

        return obj;
    };

    const reset = () => {
        if (store) {
            // console.log('Resetting ',store);
            let powerbi = store.store.powerbi;
            if (powerbi && rootElement.current) powerbi.reset(rootElement.current);
        }
        store.report = null;
    };

    const embed = config => {
        let report = powerbi.embed(rootElement.current, config);
        //let report = powerbi.load(rootElement.current, config);
        console.log("store.saveEmbed(powerbi,config,report);");
        store.saveEmbed(powerbi, config, report);
        report.setAccessToken(config.accessToken).then(() => {
            // Set token expiration listener
            // result.expiration is in ISO format
            setTokenExpirationListener(
                config.ellapse,
                2 /*minutes before expiration*/
            );
        });
        const height = rootElement.current.clientHeight;
        const width = rootElement.current.clientWidth;
        performOnEmbed(report, {
            height,
            width
        });
        if (props.onEmbedded) {
            props.onEmbedded(report, {
                height,
                width
            });
        }
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

    const updateToken = (reportId, groupId) => {
        // Generate new EmbedToken
        const url =
            "https://getembedfuncapp.azurewebsites.net/api/HttpTrigger1?code=MWakS6g9stuWnb1syRFdjqWDUZvmyYIYg3JeYFp23IUd6J/9jRTaSQ==&reportID=" +
            reportId +
            "&groupId=" +
            groupId;
        jsonp(
            url, {
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
                    console.log('Update token');

                    var config = createConfig({
                        isLoaded: true,
                        width: W,
                        height: H,
                        type: "report",
                        id: json.ReportId,
                        embedUrl: json.EmbedUrl,
                        tokenType: models.TokenType.Embed, //EMBED = 1, AAD = 0
                        accessToken: json.EmbedToken,
                        permissions: models.Permissions.All,
                        expiration: json.Expiry,
                        ellapse: json.Ellapse,
                        pageView: PAGEVIEW,
                        settings: {
                            filterPaneEnabled: false,
                            navContentPaneEnabled: false,
                        }
                    });

                    var configQNA = {
                        type: "qna",
                        isLoaded: true,
                        width: W,
                        height: H,
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
            }
        );
    };

    const setTokenExpirationListener = (
        ellapse,
        minutesToRefresh = 2,
        reportId,
        groupId
    ) => {
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
            console.log(
                "Report Embed Token will be updated in " +
                timeout +
                " milliseconds."
            );
            // setTimeout(() => {
            //   this.updateToken(reportId, groupId);
            // }, timeout);
        }
    };

    const updateWindowDimensions = () => {
        console.log("updateWindowDimensions");
        // if (store.isLoaded()) reset();
        // updateToken(reportID, groupID);
        let activePages = (store.pages) ? store.pages.filter(function(page) {
            return page.isActive;
        }) : null; //jQuery.grep(pages, function (page) { return page.isActive })[0];
        let activePage = (activePages) ? activePages[0] : null;
        console.log(activePage);
        if (store.report) updateCustomLayout(store.report, activePage, true);

    };


    const updateCustomLayout = (report, activePage, isResize = false) => {
      if (activePage) activePage.getVisuals().then(function (visuals) {

        // var reportVisuals = visuals.map(function (visual) {
        //     console.log(visual);
        //     return {
        //         name: visual.name,
        //         title: visual.title,
        //         layout: visual.layout,
        //         checked: !((visual.layout.displayState.mode == models.VisualContainerDisplayMode.Hidden) ||
        //           (visual.title == "Language") ||
        //           (visual.title == "active_BT_Thongtinchung") ||
        //           (visual.title == "Lọc phía tiêu đề") ||
        //           (visual.title == "active_ssqt") ||
        //           (visual.title == "Active_BT VĐXH") ||
        //           ((visual.title !== undefined) && (visual.title !== null) && (visual.title.substr(0, 3).toLowerCase() == "bt_"))
        //         )
        //     };
        // });

        // let checkedVisuals = reportVisuals.filter(function (visual) { return visual.checked; });
        let visualsLayout = {};
        let maxY = 0, maxX = 0;
        const height = rootElement.current.clientHeight;
        const width = rootElement.current.clientWidth;
        let pageHeight = 0.95*height, pageWidth = width*0.97;
        console.log(pageWidth, pageHeight);
        console.log("Active Page ",activePage);
        if (!store.store.pageDefaultSize)
          store.setDefaultSize(activePage.defaultSize);
        console.log(store.defaultSize.width, store.defaultSize.height);
        let rY = (store.defaultSize.height)/(pageHeight);
        let rX = (store.defaultSize.width)/(pageWidth);
        console.log(rX, rY);
        if (rX > rY) {
          rY = rX;
          pageHeight = pageWidth*store.defaultSize.height/store.defaultSize.width;
        } else {
          rX = rY;
          pageWidth = pageHeight*store.defaultSize.width/store.defaultSize.height;
        }

        for (let i = 0; i < visuals.length; i++) {
          let visual = visuals[i];          
          let vName = visual.name;
          let checked = !((visual.layout.displayState.mode == models.VisualContainerDisplayMode.Hidden) ||
            (visual.layout.x == 0) ||
            (visual.title == "Language") ||
            // (visual.title == "active_BT_Thongtinchung") ||
            // (visual.title == "Lọc phía tiêu đề") ||
            // (visual.title == "active_ssqt") ||
            // (visual.title == "Active_BT VĐXH") ||
            // (visual.title == undefined && visual.type != "slicer") ||
            ((visual.title !== undefined) && (visual.title !== null) && (visual.title.substr(0, 3).toLowerCase() == "bt_"))
          );
          // console.log(checked,visual.type,visual);
          let vHash = activePage.displayName+"_"+vName;

          if (!store.store.visuals[vHash]) {
            store.store.visuals[vHash] = {
              layout: visual.layout
            };
            // store.store.visuals[vName].layout.x = visual.layout.x;
            // store.store.visuals[vName].layout.y = visual.layout.y;
            // store.store.visuals[vName].layout.width = visual.layout.width;
            // store.store.visuals[vName].layout.height = visual.layout.height;
          }
          // let vX = Math.floor(store.store.visuals[vHash].layout.x*rX),
          //     vY = Math.floor(store.store.visuals[vHash].layout.y*rY),
          //     vWidth = Math.floor(store.store.visuals[vHash].layout.width*rX),
          //     vHeight = Math.floor(store.store.visuals[vHash].layout.height*rY);
          // if (checked){
          //   console.log(vX, vY, vWidth, vHeight);
          //   console.log("Check ",visual);  
          // }
            
          console.log(vHash);

            let layout = store.store.visuals[vHash].layout;
            visualsLayout[visual.name] = {
                x: layout.x,
                y: layout.y-30,
                z: layout.z,
                width: layout.width,
                height: layout.height,
                displayState: {
                    // Change the selected visuals display mode to visible
                    mode: checked == true ? models.VisualContainerDisplayMode.Visible : models.VisualContainerDisplayMode.Hidden
                }
            }
          
            // Calculating (x,y) position for the next visual
            // x += width + LayoutShowcaseConsts.margin;
            // if (x + width > pageWidth) {
            //     x = LayoutShowcaseConsts.margin;
            //     y += height + LayoutShowcaseConsts.margin;
            // }
        }
        let pagesLayout = {};
        pagesLayout[activePage.name] = {
            defaultLayout: {
                displayState: {

                        // Default display mode for visuals is hidden
                        mode: models.VisualContainerDisplayMode.Hidden
                    }
                },
                visualsLayout: visualsLayout
            };

        //console.log(visualsLayout);

        // Building settings object
        // enum DisplayOption {
        //     FitToPage,
        //     FitToWidth,
        //     ActualSize
        // }
        let settings = {};
        if (isResize)
          settings = {
              layoutType: models.LayoutType.Custom,
              customLayout: {
                  // pageSize: {
                  //     type: models.PageSizeType.Custom,
                  //     width: Math.floor(pageWidth),
                  //     height: Math.floor(pageHeight)
                  // },
                  displayOption: models.DisplayOption.FitToPage,
                  pagesLayout: pagesLayout
              }
          };
        else {
          settings = {
              layoutType: models.LayoutType.Custom,
              customLayout: {
                  displayOption: isResize?models.DisplayOption.FitToWidth:models.DisplayOption.FitToPage,
                  pagesLayout: pagesLayout
              }
          };
        }

        // If pageWidth or pageHeight is changed, change display option to actual size to add scroll bar
        // if (pageWidth !== $('#embedContainer').width() || pageHeight !== $('#embedContainer').height()) {
        //     settings.customLayout.displayOption = models.DisplayOption.ActualSize;
        // }
        // Change page background to transparent on Two / Three columns configuration

        //settings.background = (LayoutShowcaseState.columns === ColumnsNumber.One) ? models.BackgroundType.Default : models.BackgroundType.Transparent;
        settings.background = isResize?models.BackgroundType.Transparent:models.BackgroundType.Default;
        // console.log(JSON.stringify(settings));
        // Call updateSettings with the new settings object

        if (!isResize) {
          report.updateSettings(settings).then(function(){
            console.log("updateSettings");
          });
          store.store.updateCustomLayout = true;
        } else {
          console.log(settings);
          report.updateSettings(settings).then(function(){
            console.log("updateSettings-Resize");
            // powerbi.get(rootElement.current).reload();
          });
          store.store.updateCustomLayout = false;
        }
        return settings;
      });
    }

    const performOnEmbed = (report, dimensions) => {
        const {
            embedType,
            onLoad,
            onSelectData,
            onPageChange,
            onTileClicked
        } = props;
        //if (DEBUG) console.log('performOnEmbed ',embedType,report,onLoad,onSelectData,onPageChange,onTileClicked);
        if (embedType === "report") {
            //if (DEBUG) console.log("Registering event handlers...");

            report.off("rendered");
            report.on("rendered", () => {
                //window.alert("rendered EVENT");
                console.log("rendered");

                // console.log(store.store.bookmarks);
                report.getPages().then(function(pages) {
                    if (pages.length > 0) {
                        const firstPage = pages[0];
                        let activePages = pages.filter(function(page) {
                            return page.isActive;
                        }); //jQuery.grep(pages, function (page) { return page.isActive })[0];
                        if (activePages.length > 0)
                            store.setCurrentPage(activePages[0]);
                        else {
                            firstPage.isActive = true;
                            store.setCurrentPage(firstPage);
                        }

                        // Ensure the pages array is empty before adding pages
                        store.clearPages();

                        pages.forEach(function(page) {
                            store.addPage(page);
                        });
                    }
                });

                // Fix report rendered that is called more than 1 time.
                // report.off("rendered");
            });

            // Report.off removes a given event handler if it exists.
            report.off("loaded");
            report.on("loaded", () => {
                // var expiration = report.config.expiration;
                // console.log(expiration+"   ;   "+report.config.id+"    ;   "+report.config.groupId);
                console.log("Report-loaded");
                var ellapse = report.config.ellapse;
                setTokenExpirationListener(
                    ellapse,
                    2 /*minutes before expiration*/ ,
                    report.config.id,
                    report.config.groupId
                );

                report.getPages().then(function(pages) {
                    console.log("Set layoutPageName to active page name");
                    // Retrieve active page
                    let activePages = pages.filter(function(page) {
                        return page.isActive;
                    }); //jQuery.grep(pages, function (page) { return page.isActive })[0];
                    let activePage = activePages[0];

                    // Retrieve active page visuals.
                    updateCustomLayout(report, activePage, true);
                });

                let bookmarks = report.bookmarksManager.getBookmarks().then(function (bookmarks) {
                  // console.log(bookmarks);
                  store.clearBookmarks();
                  bookmarks.forEach(function(bookmark) {
                      store.addBookmark(bookmark);
                  });
                });

                if (onLoad) onLoad(report, dimensions);
            });

            report.on("error", function(event) {
                // Log.log(event.detail);
                console.log(event.detail);
                alert(event.detail.detailedMessage);
                report.off("error");
            });

            report.off("dataSelected");
            report.on("dataSelected", event => {
                if (onSelectData) {
                    onSelectData(event.detail);
                }
            });

            report.off("pageChanged");
            report.on("pageChanged", event => {

                console.log("pageChanged: " + event.detail.newPage.name);
                const newPageName = event.detail.newPage.name;
                const pages = store.getPages();
                if (pages.length > 0) {
                    let activePages = pages.filter(function(page) {
                        return page.name == newPageName;
                    }); //jQuery.grep(pages, function (page) { return page.isActive })[0];
                    if (activePages.length > 0)
                        store.setCurrentPage(activePages[0]);
                    else {
                      const firstPage = pages.filter(function(page) {
                        return page.isActive;
                      });
                      store.setCurrentPage(firstPage[0]);
                    }
                    // Retrieve active page visuals.
                    const activePage = store.store.currentPage;
                    updateCustomLayout(report, activePage, true);
                }
                if (onPageChange) {
                    onPageChange(event.detail);
                }
            });

            report.off("bookmarkApplied");
            report.on("bookmarkApplied", (event) => {
              console.log("bookmarkApplied: "+event.detail.bookmarkName);
              // Retrieve active page visuals.
              const activePage = store.store.currentPage;
              updateCustomLayout(report, activePage, true);
            });

            //if (DEBUG) console.log("Registering event handlers finished ...",rp);
        } else if (embedType === "dashboard") {
            report.off("tileClicked");
            report.on("tileClicked", event => {
                if (onTileClicked) {
                    onTileClicked(report, event.detail);
                }
            });
        }
    };


    useLayoutEffect(() => {
        savedHandler.current = source
            .pipe(debounceTime(1500))
            .subscribe(updateWindowDimensions);
        // let h = props.height ? props.height : $(window).height();
        // let rect = rootElement.current.getBoundingClientRect();
        // let top = rect.top + window.scrollY;
        // let height = h - 1.1 * (top - h) + "px";
        // dimension.current = {
        //     height: H
        // };

        store.setDimension({
            width: W,
            height: H
        });
        // var subscription = source.pipe(debounceTime(1500)).subscribe(updateWindowDimensions);
        // rootElement.current.style.height = H;
        updateToken(reportID, groupID);
        // console.log("HH = ", h, top);

        //Unsubscribe on clean up
        return () => {
            console.log("Cleaning up");
            savedHandler.current.unsubscribe();
        };
    });

    return ( <
        div style = {
            {
                backgroundImage: "linear-gradient(#21224d, #000000)"
            }
        } >
        <
        div id = "PBI"
        ref = {
            rootElement
        }
        style = {
            {
                width: W,
                height: H,
                margin: 0,
                padding: 0
            }
        } >
        <
        h2 > A Todo App yet again! < /h2>{" "} < /
        div > <
        /div>
    );
});

const TestScreen = props => {
    // const [columWidth, setColumnWidth] = useState({
    //     left: 6,
    //     right: 18,
    //     rightContent: <div> No info </div>,
    //     leftContent: <div> No info </div>
    // });
    // const [bgColor, setbgColor] = useState("white");
    const [{
        dashboard,
        theme
    }, dispatch] = getState();


    return <PBIScreen embedType = "report" / > ;
};

TestScreen.propTypes = {};

export default TestScreen;
