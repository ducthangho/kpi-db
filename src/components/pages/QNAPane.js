import React, {
    Children,
    useContext,
    useState,
    useEffect,
    useRef
} from "react";
import {
    getState,
    getStore
} from "state";

import {
    observer,
    Observer
} from "mobx-react-lite";

import pbi, {
    models
} from "powerbi-client";

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



const QNAPane = observer(props => {
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
        updateToken(panel, groupId, datasetId);
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


    const updateCustomLayout = (report, activePage, isResize = false) => {
        if (activePage) activePage.getVisuals().then(function(visuals) {

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
            let maxY = 0,
                maxX = 0;
            const height = rootElement.current.clientHeight;
            const width = rootElement.current.clientWidth;
            let pageHeight = 0.95 * height,
                pageWidth = width * 0.97;
            console.log(pageWidth, pageHeight);
            console.log("Active Page ", activePage);
            if (!store.store.pageDefaultSize)
                store.setDefaultSize(activePage.defaultSize);
            console.log(store.defaultSize.width, store.defaultSize.height);
            let rY = (store.defaultSize.height) / (pageHeight);
            let rX = (store.defaultSize.width) / (pageWidth);
            console.log(rX, rY);
            if (rX > rY) {
                rY = rX;
                pageHeight = pageWidth * store.defaultSize.height / store.defaultSize.width;
            } else {
                rX = rY;
                pageWidth = pageHeight * store.defaultSize.width / store.defaultSize.height;
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
                let vHash = activePage.displayName + "_" + vName;

                if (!store.store.visuals[vHash]) {
                    store.store.visuals[vHash] = {
                        layout: visual.layout
                    };
                }

                // console.log(vHash);

                let layout = store.store.visuals[vHash].layout;
                visualsLayout[visual.name] = {
                    x: layout.x,
                    y: layout.y - 30,
                    z: layout.z,
                    width: layout.width,
                    height: layout.height,
                    displayState: {
                        // Change the selected visuals display mode to visible
                        mode: checked == true ? models.VisualContainerDisplayMode.Visible : models.VisualContainerDisplayMode.Hidden
                    }
                }
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
                        displayOption: isResize ? models.DisplayOption.FitToWidth : models.DisplayOption.FitToPage,
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
            settings.background = isResize ? models.BackgroundType.Transparent : models.BackgroundType.Default;
            // console.log(JSON.stringify(settings));
            // Call updateSettings with the new settings object

            if (!isResize) {
                report.updateSettings(settings).then(function() {
                    console.log("updateSettings");
                });
                store.store.updateCustomLayout = true;
            } else {
                console.log(settings);
                report.updateSettings(settings).then(function() {
                    console.log("updateSettings-Resize");
                    // powerbi.get(rootElement.current).reload();
                });
                store.store.updateCustomLayout = false;
            }
            return settings;
        });
    }

    const updateToken = (panel, groupId, datasetId) => {
        // Generate new EmbedToken
        const url =
            getEmbedToken + "&datasetId=" + datasetId + "&groupId=" + groupId;
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
                        question: question,
                        settings: {
                            background: models.BackgroundType.Transparent,
                            layoutType: models.LayoutType.Custom,
                            customLayout: {
                                displayOption: models.DisplayOption.FitToPage,
                                // pagesLayout: pagesLayout
                            }
                        }
                    };

                    // updateState(config);
                    //const errors = validateConfig(config);
                    //if (!errors) {
                    store.saveEmbedQNAConfig(configQNA);
                    embedQNA(panel, configQNA);
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
        qna.off("loaded");
        qna.off("visualRendered");

        qna.on("loaded", function() {
          console.log("QNA-loaded");
            qna.getVisuals().then(function(visuals) {
                if (visuals.length > 0) {
                    
                    visuals.forEach(function(visual) {
                        console.log('QNA ',visual);
                    });
                }
            });
        });

        // qna.on will add an event listener.
        qna.on("visualRendered", function(event) {
            console.log(event.detail);
        });

    };

    useEffect(() => {
        console.log('EMBEDDING QNAPane ', searchRef.current);
        if (searchRef.current) loadQNA(searchRef.current);
    })

    return ( <
        div ref = {
            searchRef
        }
        style = {
            {
                width: W,
                height: H
            }
        } > New Tab Content < /div>
    )

})

export default QNAPane;