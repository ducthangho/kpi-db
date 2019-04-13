import React, { useState,useContext,useRef, useEffect,useLayoutEffect, memo } from "react";
import ReactDom from "react-dom";
import { Layout, Menu, Icon, Divider } from "antd";
//import "../../pages/MainPage/styles/main.css";
//import "antd/dist/antd.css";
import styled,{ injectGlobal,css } from "styled-components";
import triggerImg from "../../pages/MainPage/styles/trigger.svg";
import generalImg from "../../pages/MainPage/styles/general.svg";
import riseImg from "../../pages/MainPage/styles/rise.svg";
import balanceImg from "../../pages/MainPage/styles/balance.svg";
import institutionImg from "../../pages/MainPage/styles/institution.svg";
import PFinanceImg from "../../pages/MainPage/styles/PublicFinance.svg";
import BusinessEnvImg from "../../pages/MainPage/styles/BusinessEnv.svg";
import LabourImg from "../../pages/MainPage/styles/Labour.svg";
import SocialImg from "../../pages/MainPage/styles/Social.svg";
import EnvImg from "../../pages/MainPage/styles/environment.svg";
import InfraImg from "../../pages/MainPage/styles/infrastructure.svg";


import InternationalImg from "../../pages/MainPage/styles/ssqt.svg";
import SearchImg from "../../pages/MainPage/styles/ic-search.svg";
import EditImg from "../../pages/MainPage/styles/edit.svg";
import InfoImg from "../../pages/MainPage/styles/info.svg";
const { Sider } = Layout;
import { getState, getStore } from "../../../state";
import {
    observer,
    useDisposable,
    useObserver
} from 'mobx-react-lite';
// import {autorun} from 'mobx';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

injectGlobal`
#app .logo {
  width: 40px;
  height: 40px;
  background-color: #21224d;  
  padding: 0px;
  margin: 0px;
}

.popup_submenu{
  resize: both;
  min-width: 180px;
  max-width:400px;  
  width: auto;
}

.collapsed_popup_submenu{
  resize: both;
  min-width: 50px;
  max-width:300px;  
  width: auto;
  margin: auto;    
}

.sub-menu li{
    background: #21224d !important;
}

.modified-item:hover {  
  border-bottom: 2px solid transparent !important;
  color: inherit !important;  
  border-color: white !important;  
  background-color: #21224d;  
  min-width: 50px;
  max-width:300px;  
  width: auto;
  margin: auto;  
}

.submenu-item{
  padding: 10px;  
  background-color: #21224d;
  margin: 0px  
}

.modified-item{  
  padding: 10px;  
  background-color: #21224d;  
  min-width: 50px;
  max-width:300px;  
  width: auto;
  margin: auto;
}

.custom-icons-list > .anticon {
  margin-right: 6px;
  margin-left: 15px;
  font-size:28px;
}

.menu-item{
  fontSize : 24px;
  padding: 10px;  
}

.ant-menu-item{
  fontSize : 24px;
  padding: 10px;
  background-color: #21224d;    
}

`;

const CoverPage = 0;
const MenuPage = 1;
const Layer1 = 2;
const TaoBaoCao = 3;
const TTKT = 4;
const MTKD = 5;
const VĐXH = 6;
const SoSanhQuocTe = 7;
const VĐXH2_1 = 8;
const TTKT2_1 = 9;
const MTKD2_1 = 10;
const PageNen = 11;
const ChiTiet = 12;
const ChiTietDP = 13; 
const Dubao = 14;
const ChitietSS = 15;

const FONTSIZE='24px'
const MARGINTOP='-40px'
const MENUITEMPADDING="0 0 0 10px";

const ImgSvg = () => (
  <img src={triggerImg}/>
);

const TriggerIcon = props => (
  <Icon component={ImgSvg()} {...props} />
);

const GeneralInfoIcon = props => (
  <Icon component={ () => <img src={generalImg}/>  } {...props} />
);


const RiseIcon = props => (
  <Icon component={ () => <img src={riseImg}/>  } {...props} />
);

const BalanceIcon = props => (
  <Icon component={ () => <img src={balanceImg}/>  } {...props} />
);


const FinanceIcon = props => (
  <Icon component={ () => <img src={PFinanceImg}/>  } {...props} />
);

const InstitutionIcon = props => (
  <Icon component={ () => <img src={institutionImg}/>  } {...props} />
);


const BusinessEnvIcon = props => (
  <Icon component={ () => <img src={BusinessEnvImg}/>  } {...props} />
);

const LabourIcon = props => (
  <Icon component={ () => <img src={LabourImg}/>  } {...props} />
);

const SocialIcon = props => (
  <Icon component={ () => <img src={SocialImg}/>  } {...props} />
);

const EnvIcon = props => (
  <Icon component={ () => <img src={EnvImg}/>  } {...props} />
);

const InfraIcon = props => (
  <Icon component={ () => <img src={InfraImg}/>  } {...props} />
);

const InternationalIcon = props => (
  <Icon component={ () => <img src={InternationalImg} width = '50px' height = '50px'/>  } {...props} />
);

const SearchIcon = props => (
  <Icon component={ () => <img src={SearchImg}/>  } {...props} />
);

const InfoIcon = props => (
  <Icon component={ () => <img src={InfoImg}/>  } {...props} />
);

const EditIcon = props => (
  <Icon component={ () => <img src={EditImg}/>  } {...props} />
);


const ADDSPACE = props => (
  <span>&nbsp;&nbsp;&nbsp;&nbsp; </span>
);


const MainSidebar = observer ( ( {lang} ) => {
  const [isExpand, setExpand] = useState(true);
  const [{ dashboard, theme }, dispatch] = getState();
  const store = useContext(getStore());
 
  const onCollapse = collapsed => {    
    setExpand(collapsed);
  };

  const toggle = () => {    
    setExpand(!isExpand);
  }

  const onSearch = value => {
    dispatch({
      type: "doSearch",
      searchText: value
    });    
    dispatch({
      type: "toggleDrawer",
      showDrawer: true
    });
  };


  const navigateTo = (pageIndx) => {
    let pages = store.getPages();

    let report = store.store.report;
    if (pageIndx<pages.length){
      let page = pages[pageIndx];
      console.log(page.name + " - " + page.displayName);
      // console.log('Goto : ',pages);
      report.setPage(page.name);    
    }

    console.log('DISPLAYING');

    switch (pageIndx) {
        case CoverPage: 
          console.log(store.text.get("GENERAL_INFO"));
          store.saveTitle("GENERAL_INFO",store.text.get("GENERAL_INFO"));
        break;
        case MenuPage:
          console.log(store.text.get("GENERAL_INFO"));
          store.saveTitle("GENERAL_INFO",store.text.get("GENERAL_INFO")); 
        break;
        case Layer1: 
          console.log(store.text.get("GENERAL_INFO"));
          store.saveTitle("GENERAL_INFO",store.text.get("GENERAL_INFO"));
        break;
        case TaoBaoCao: 
          console.log(store.text.get("REPORT_CREATION"));
          store.saveTitle("REPORT_CREATION",store.text.get("REPORT_CREATION"));
        break;
        case TTKT: 
          console.log(store.text.get("ECO_GROWTH"));
          store.saveTitle("ECO_GROWTH",store.text.get("ECO_GROWTH"));
        break;
        case MTKD: 
          console.log(store.text.get("BUSINESS_ENVIRONMENT"));          
          store.saveTitle("BUSINESS_ENVIRONMENT",store.text.get("BUSINESS_ENVIRONMENT"));
        break;
        case VĐXH:
          console.log(store.text.get("SOCIAL_ISSUES"));          
          store.saveTitle("SOCIAL_ISSUES",store.text.get("SOCIAL_ISSUES"));          
        break;
        case SoSanhQuocTe: 
          console.log(store.text.get("INTERNATIONAL_COMPARISON"));    
          store.saveTitle("INTERNATIONAL_COMPARISON",store.text.get("INTERNATIONAL_COMPARISON"));
        break;
        case VĐXH2_1:
          console.log(store.text.get("POVERTY_REDUCTION"));    
          store.saveTitle("POVERTY_REDUCTION",store.text.get("POVERTY_REDUCTION"));          
        break;
        case TTKT2_1:         
          console.log(store.text.get("GDP_GROWTH"));    
          store.saveTitle("GDP_GROWTH",store.text.get("GDP_GROWTH"));
        break;
        case MTKD2_1: 
          console.log(store.text.get("BUSINESS_DEVELOPMENT"));          
          store.saveTitle("BUSINESS_DEVELOPMENT",store.text.get("BUSINESS_DEVELOPMENT"));          
        break;
        case PageNen:
          console.log(store.text.get("BUSINESS_DEVELOPMENT"));     
          store.saveTitle("GENERAL_INFO",store.text.get("GENERAL_INFO"));
        break;
        case ChiTiet: 
          store.saveTitle("GENERAL_INFO",store.text.get("GENERAL_INFO"));
        break;
        case ChiTietDP: 
          store.saveTitle("GENERAL_INFO",store.text.get("GENERAL_INFO"));
        break;
        case Dubao: 
          console.log(store.text.get("INSTRUCTION"));    
          store.saveTitle("INSTRUCTION",store.text.get("INSTRUCTION"));
        break;
        case ChitietSS: 
          console.log(store.text.get("INSTRUCTION"));   
          store.saveTitle("INTERNATIONAL_COMPARISON",store.text.get("INTERNATIONAL_COMPARISON"));
        break;
        default:
          // statements_def
          console.log(store.text.get("GENERAL_INFO"));
          store.saveTitle("GENERAL_INFO",store.text.get("GENERAL_INFO"));
          break;
      }
      console.log('CURRENT STRING IS ',store.Title);
  }

  // useLayoutEffect(() => {        
    if (!store.locales.initDone){
      console.log("Set title ",store.text.get("GENERAL_INFO"))
      store.saveTitle("GENERAL_INFO",store.text.get("GENERAL_INFO"));  
      console.log("Title is now ",store.Title);    
    }
  // })

  return (     
    <Sider
      id="my-sider"
      theme="dark"
      collapsible      
      collapsed={isExpand}
      style={{
        backgroundColor: "#21224d",
        height: "100vh",        
      }}
      width = "250px"
      onCollapse={onCollapse}
      collapsedWidth="50px"
      trigger={null}
      mode='vertical'   
    >
      <div className="logo" > 
      <a onClick={toggle}> <Icon type={isExpand ? 'menu-unfold' : 'menu-fold'} style={{fontSize:'28px',paddingLeft: '0px', margin: '10px',color:'white'}} /> </a>      
      </div>
      <Divider style={{margin : '10px 0px 5px 0px'}}/>

      <Menu
        theme="dark"
        mode='vertical-left'        
        inlineIndent={1}
        onSelect={selectedKeys => {
          console.log(selectedKeys);
        }}       

         style={{
            backgroundColor: "#21224d",       
            marginLeft: (isExpand) ? '-22px' : '-10px',
            marginTop: '0px',
            padding: '0px',            
            width : 'auto'
          }}           
      >
        <Menu.Item className="modified-item"         
          key="1"            
          onClick={() => {
             navigateTo(Layer1);   
          }}                  
        >
          <GeneralInfoIcon style={{fontSize:FONTSIZE,opacity : '0.7',color: 'gray',marginTop : MARGINTOP}} />
          <span>{store.text.get("GENERAL_INFO")}</span>
        </Menu.Item>

        <SubMenu key="TTKT"            
              className={!isExpand ? "popup_submenu" : "collapsed_popup_submenu"}
              title={<span><RiseIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/><span>{store.text.get("ECO_GROWTH")}</span></span>}>           

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="2"
                onClick={() => {
                  navigateTo(TTKT);            
                }}
              >                  
                <span>{store.text.get("GDP_GROWTH")}</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="2.1"
                onClick={() => {
                  navigateTo(TTKT);            
                }}
              >                  
                <span>{store.text.get("FOREIGN_TRADE")}</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="2.2"
                onClick={() => {
                  navigateTo(TTKT);            
                }}
              >                  
                <span>{store.text.get("INVEST")}</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="2.3"
                onClick={() => {
                  navigateTo(TTKT);            
                }}
              >                  
                <span>{store.text.get("CONSUMPTION")}</span>
                <ADDSPACE />
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="2.4"
                onClick={() => {
                  navigateTo(TTKT);            
                }}
              >                  
                <span>{store.text.get("GROWTH_QUALITY")}</span>
              </Menu.Item>
          
        </SubMenu>

        <Menu.Item className="modified-item"         
          selectable
          key="3"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <BalanceIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}} />
          <span>{store.text.get("MACROECONOMIC_STABILITY")}</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="4"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <FinanceIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/>
          <span>{store.text.get("PUBLIC_FINANCE")}</span>
        </Menu.Item>
       

        <SubMenu key="MTKD"            
              className={!isExpand ? "popup_submenu" : "collapsed_popup_submenu"}
              title={<span><BusinessEnvIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/><span>{store.text.get("BUSINESS_ENVIRONMENT")}</span></span>}>           
             
              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="5.1"
                onClick={() => {
                  navigateTo(MTKD2_1);            
                }}
              >                  
                <span>{store.text.get("BUSINESS_DEVELOPMENT")}</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="5.2"
                onClick={() => {
                  navigateTo(MTKD2_1);            
                }}
              >                  
                <span>{store.text.get("BUSINESS_ADVANTAGES")}</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="5.3"
                onClick={() => {
                  navigateTo(MTKD2_1);            
                }}
              >                  
                <span>{store.text.get("NATIONAL_COMPETITIVENESS")}</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="5.4"
                onClick={() => {
                  navigateTo(MTKD2_1);            
                }}
              >                  
                <span>{store.text.get("PROVINCIAL_COMPETITIVENESS")}</span>
                <ADDSPACE />
              </Menu.Item>
          
        </SubMenu>

       

        <Menu.Item className="modified-item"         
          selectable
          key="6"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <InstitutionIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/>
          <span>{store.text.get("PUBLIC_ADMINISTRATION")}</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="7"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <LabourIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/>
          <span>{store.text.get("LABOUR_AND_WORKFORCE")}</span>
        </Menu.Item>

      
        <SubMenu key="VĐXH"            
              className={!isExpand ? "popup_submenu" : "collapsed_popup_submenu"}
              title={<span><SocialIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/><span>{store.text.get("SOCIAL_ISSUES")}</span></span>}>           
             
              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="8.1"
                onClick={() => {
                  navigateTo(VĐXH);            
                }}
              >                  
                <span>{store.text.get("POVERTY_REDUCTION")}</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="8.2"
                onClick={() => {
                  navigateTo(VĐXH2_1);            
                }}
              >                  
                <span>{store.text.get("HEALTHCARE")}</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="8.3"
                onClick={() => {
                  navigateTo(VĐXH2_1);            
                }}
              >                  
                <span>{store.text.get("EDUCATION")}</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="8.4"
                onClick={() => {
                  navigateTo(VĐXH2_1);            
                }}
              >                  
                <span>{store.text.get("TRANSPORTATION")}</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="8.5"
                onClick={() => {
                  navigateTo(VĐXH2_1);            
                }}
              >                  
                <span>{store.text.get("SOCIAL_SECURITY")}</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="8.6"
                onClick={() => {
                  navigateTo(VĐXH2_1);            
                }}
              >                  
                <span>{store.text.get("URBAN")}</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="8.7"
                onClick={() => {
                  navigateTo(VĐXH2_1);            
                }}
              >                  
                <span>{store.text.get("WELFARE")}</span>
              </Menu.Item>
          
        </SubMenu>

        <Menu.Item className="modified-item"         
          selectable
          key="9"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <EnvIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/>
          <span>{store.text.get("ENVIRONMENT")}</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="10"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <InfraIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/>
          <span>{store.text.get("WELFARE")}</span>
        </Menu.Item>


         

         <div style= {{height:"145px"}}>&nbsp;</div>

         <Menu.Item className="modified-item"         
          selectable
          key="11"
          onClick={() => {
            navigateTo(SoSanhQuocTe);            
          }}
        >
          <InternationalIcon style={{fontSize:FONTSIZE, marginLeft: '-12px', marginRight: '0px', marginTop: '-20px' , padding:'0px'}} />
          <span>{store.text.get("INTERNATIONAL_COMPARISON")}</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="12"
          onClick={() => {
            onSearch("");
          }}
        >
          <SearchIcon style={{fontSize:FONTSIZE, marginRight: '10px', marginTop: '-20px' , padding:'0px'}}/>
          <span>{store.text.get("SEARCH")}</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="13"
          onClick={() => {
            navigateTo(Dubao);            
          }}
        >
          <InfoIcon style={{fontSize:FONTSIZE,marginRight: '10px', marginTop: '-20px' , padding:'0px'}}/>
          <span>{store.text.get("INSTRUCTION")}</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="14"
          onClick={() => {
            navigateTo(TaoBaoCao);            
          }}
        >
          <EditIcon style={{fontSize:FONTSIZE,  marginRight: '10px', marginTop: '-20px' , padding:'0px'}}/>
          <span>{store.text.get("REPORT_CREATION")}</span>
        </Menu.Item>

      </Menu>
    </Sider>
  );
})

// function arePropsEqual(prevProps, nextProps) {
//   return prevProps.lang === nextProps.lang; 
// }

export default MainSidebar;
