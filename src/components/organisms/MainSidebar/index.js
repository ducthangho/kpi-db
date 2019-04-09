import React, { useState,useContext,useRef } from "react";
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
    useDisposable
} from 'mobx-react-lite';

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

.sub-menu li{
    background: #21224d !important;
}

.modified-item:hover {
  border-bottom: 2px solid transparent !important;
  color: inherit !important;  
  border-color: white !important;  
  background-color: #21224d;
  margin: 0px  
}

.submenu-item{
  padding: 10px;  
  background-color: #21224d;
  margin: 0px  
}

.modified-item{
  padding: 10px;  
  background-color: #21224d;
  margin: 0px  
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


const MainSidebar = observer ( () => {
  const [isExpand, setExpand] = useState(true);
  const [{ dashboard, theme }, dispatch] = getState();

  const store = useContext(getStore());

  const onCollapse = collapsed => {    
    setExpand(collapsed);
  };

  const toggle = () => {    
    setExpand(!isExpand);
  }


  const navigateTo = (pageIndx) => {
    let pages = store.getPages();

    let report = store.store.report;
    if (pageIndx<pages.length){
      let page = pages[pageIndx];
      console.log(page.name + " - " + page.displayName);
      // console.log('Goto : ',pages);
      report.setPage(page.name);
    }
  }

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
            marginTop: '  0px',
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
          <span>Thông tin chung</span>
        </Menu.Item>

        <SubMenu key="TTKT"            

              title={<span><RiseIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/><span>Tăng trưởng kinh tế</span></span>}>           

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="2"
                onClick={() => {
                  navigateTo(TTKT);            
                }}
              >                  
                <span>Tăng trưởng GDP</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="2.1"
                onClick={() => {
                  navigateTo(TTKT);            
                }}
              >                  
                <span>Ngoại thương</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="2.2"
                onClick={() => {
                  navigateTo(TTKT);            
                }}
              >                  
                <span>Đầu tư</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="2.3"
                onClick={() => {
                  navigateTo(TTKT);            
                }}
              >                  
                <span>Tiêu dùng và du lịch</span>
              </Menu.Item>

              <Menu.Item className="modified-item"         
                selectable
                style={{ margin: '0px', padding: MENUITEMPADDING,backgroundColor: "#21224d"}}
                key="2.4"
                onClick={() => {
                  navigateTo(TTKT);            
                }}
              >                  
                <span>Chất lượng tăng trưởng</span>
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
          <span>Ổn định kinh tế vĩ mô</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="4"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <FinanceIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/>
          <span>Tài chính công</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="5"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <BusinessEnvIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/>
          <span>Môi trường kinh doanh</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="6"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <InstitutionIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/>
          <span>Bộ máy hành chính</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="7"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <LabourIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/>
          <span>Lao động việc làm</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="8"
          onClick={() => {
            navigateTo(VĐXH);            
          }}
        >
          <SocialIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/>
          <span>Các vấn đề xã hội</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="9"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <EnvIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/>
          <span>Môi trường</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="10"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <InfraIcon style={{fontSize:FONTSIZE,marginTop : MARGINTOP}}/>
          <span>Kết cấu hạ tầng và khoa học công nghệ</span>
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
          <span>So sánh quốc tế</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="12"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <SearchIcon style={{fontSize:FONTSIZE, marginRight: '10px', marginTop: '-20px' , padding:'0px'}}/>
          <span>Tìm kiếm</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="13"
          onClick={() => {
            navigateTo(Dubao);            
          }}
        >
          <InfoIcon style={{fontSize:FONTSIZE,marginRight: '10px', marginTop: '-20px' , padding:'0px'}}/>
          <span>Hướng dẫn</span>
        </Menu.Item>

        <Menu.Item className="modified-item"         
          selectable
          key="14"
          onClick={() => {
            navigateTo(TaoBaoCao);            
          }}
        >
          <EditIcon style={{fontSize:FONTSIZE,  marginRight: '10px', marginTop: '-20px' , padding:'0px'}}/>
          <span>Tạo báo cáo</span>
        </Menu.Item>

      </Menu>
    </Sider>
  );
})
export default MainSidebar;
