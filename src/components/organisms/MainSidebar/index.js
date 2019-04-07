import React, { useState,useContext,useRef } from "react";
import ReactDom from "react-dom";
import { Layout, Menu, Icon, Divider } from "antd";
//import "../../pages/MainPage/styles/main.css";
//import "antd/dist/antd.css";
import styled,{ injectGlobal,css } from "styled-components";
import triggerImg from "../../pages/MainPage/styles/trigger.svg";
const { Sider } = Layout;
import { getState, getStore } from "../../../state";
import {
    observer,
    useDisposable
} from 'mobx-react-lite';



injectGlobal`
#app .logo {
  width: 40px;
  height: 40px;
  background-color: #21224d;  
  padding: 0px;
  margin: 0px;
}

.custom-icons-list > .anticon {
  margin-right: 6px;
  margin-left: 15px;
  font-size:28px;
}

.menu-item{
  fontSize : 24px;
}

`;

const CoverPage = 0;
const MenuPage = 1;
const Layer1 = 2;
const TTKT = 3;
const MTKD = 4;
const VĐXH = 5;
const TaoBaoCao = 6;
const DuplicateOfLayer2 = 7;
const Layer2 = 8;
const SoSanhQuocTe = 9;
const FONTSIZE='24px'

const ImgSvg = () => (
  <img src={triggerImg}/>
);

const TriggerIcon = props => (
  <Icon component={ImgSvg} {...props} />
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
    >
      <div className="logo" > 
      <a onClick={toggle}> <Icon type={isExpand ? 'menu-unfold' : 'menu-fold'} style={{fontSize:'28px',paddingLeft: '0px', margin: '10px',color:'white'}} /> </a>      
      </div>
      <Divider style={{margin : '10px 0px 5px 0px'}}/>

      <Menu
        theme="dark"
        mode="inline"        
        inlineIndent={0}
        onSelect={selectedKeys => {
          console.log(selectedKeys);
        }}       
         style={{
            backgroundColor: "#21224d",       
            marginLeft: (isExpand) ? '-20px' : '10px',
            paddingLeft: '0px',
            width : 'auto'
          }}           
      >
        <Menu.Item          
          key="1"            
          onClick={() => {
             navigateTo(Layer1);   
          }}                  
        >
          <Icon type="appstore" style={{fontSize:FONTSIZE}} />
          <span>Thông tin chung</span>
        </Menu.Item>
        <Menu.Item
          selectable
          key="2"
          onClick={() => {
            navigateTo(TTKT);            
          }}
        >
          <Icon type="rise" style={{fontSize:FONTSIZE}}/>
          <span>Tăng trưởng kinh tế</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="3"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <Icon type="deployment-unit" style={{fontSize:FONTSIZE}} />
          <span>Ổn định kinh tế vĩ mô</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="4"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <Icon type="dollar" style={{fontSize:FONTSIZE}}/>
          <span>Tài chính công</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="5"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <Icon type="shopping" style={{fontSize:FONTSIZE}}/>
          <span>Môi trường kinh doanh</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="6"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <Icon type="bank" style={{fontSize:FONTSIZE}}/>
          <span>Bộ máy hành chính</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="7"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <Icon type="tool" style={{fontSize:FONTSIZE}}/>
          <span>Lao động việc làm</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="8"
          onClick={() => {
            navigateTo(VĐXH);            
          }}
        >
          <Icon type="usergroup-add" style={{fontSize:FONTSIZE}}/>
          <span>Các vấn đề xã hội</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="9"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <Icon type="rest" style={{fontSize:FONTSIZE}}/>
          <span>Môi trường</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="10"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <Icon type="build" style={{fontSize:FONTSIZE}}/>
          <span>Kết cấu hạ tầng và khoa học công nghệ</span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
})
export default MainSidebar;
