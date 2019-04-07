import React, { useState,useContext,useRef } from "react";
import ReactDom from "react-dom";
import { Layout, Menu, Icon } from "antd";
//import "../../pages/MainPage/styles/main.css";
//import "antd/dist/antd.css";
import styled,{ injectGlobal,css } from "styled-components";
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
  margin: 0px;
}

li.ant-menu-item .ant-menu-item-active {
  width: 50px;
  padding : 0px;
  padding-left: 0px;
  margin: 0px
}

.categoryNav .ant-menu-submenu-title {
  padding: 0 !important;
  padding-left: 0 !important;
  margin: 0 !important;
}

div.ant-menu-submenu-title {
  padding: 0 !important;
  padding-left: 0 !important;
  margin: 0 !important;
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


const StyledMenu = styled(Menu)`
    background-color: #21224d;
    height: 100%;
    width: 'auto';
    padding-left: 0px;
    padding: 0px;
   
    .ant-menu-submenu-horizontal > .ant-menu {
        margin-top: -2px;
    }
    .ant-menu-item:hover {
        border-bottom: 2px solid #21224d;
        padding: 0px;
    }
    .about-dropdown {
        border-bottom: none;
        &:hover {
            border-bottom: none;
        }
        li:hover {
            border-bottom: none;
        }
    }
    .ant-menu-item-group-list {
        padding: 0 0 0px 0;
    }
    .ant-menu-item:li {
        padding: 0 0 0px 0;
        margin : 0;
    }
    `
const StyledMenuItem = styled(Menu.Item)`
  li {
    padding: 0px;
    padding-left: 0px;
    margin : 0;  
  }
  
`

const MainSidebar = observer ( () => {
  const [isExpand, setExpand] = useState(true);
  const [{ dashboard, theme }, dispatch] = getState();

  const store = useContext(getStore());

  const onCollapse = collapsed => {    
    setExpand(collapsed);
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
    >
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"        
        inlineIndent={0}
        onSelect={selectedKeys => {
          console.log(selectedKeys);
        }}       
         style={{
            backgroundColor: "#21224d",       
            marginLeft: (isExpand) ? '-15px' : '10px',
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
          <Icon type="appstore" />
          <span>Thông tin chung</span>
        </Menu.Item>
        <Menu.Item
          selectable
          key="2"
          onClick={() => {
            navigateTo(TTKT);            
          }}
        >
          <Icon type="rise" />
          <span>Tăng trưởng kinh tế</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="3"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <Icon type="deployment-unit" />
          <span>Ổn định kinh tế vĩ mô</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="4"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <Icon type="dollar" />
          <span>Tài chính công</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="5"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <Icon type="shopping" />
          <span>Môi trường kinh doanh</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="6"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <Icon type="bank" />
          <span>Bộ máy hành chính</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="7"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <Icon type="tool" />
          <span>Lao động việc làm</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="8"
          onClick={() => {
            navigateTo(VĐXH);            
          }}
        >
          <Icon type="usergroup-add" />
          <span>Các vấn đề xã hội</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="9"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <Icon type="rest" />
          <span>Môi trường</span>
        </Menu.Item>

        <Menu.Item
          selectable
          key="10"
          onClick={() => {
            navigateTo(MTKD);            
          }}
        >
          <Icon type="build" />
          <span>Kết cấu hạ tầng và khoa học công nghệ</span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
})
export default MainSidebar;
