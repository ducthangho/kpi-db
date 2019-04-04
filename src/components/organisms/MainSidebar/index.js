import React, { useState,useContext,useRef } from "react";
import ReactDom from "react-dom";
import { Layout, Menu, Icon } from "antd";
import { injectGlobal } from "styled-components";
const { Sider } = Layout;
import { getState, getStore } from "../../../state";
import {
    observer,
    useDisposable
} from 'mobx-react-lite';



injectGlobal`
#app .logo {
  height: 32px;
  background: rgba(255,255,255,.2);
  margin: 16px;
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

const MainSidebar = observer ( () => {
  const [isExpand, setExpand] = useState(false);
  const [{ dashboard, theme }, dispatch] = getState();

  const store = useContext(getStore());

  const onCollapse = collapsed => {
    console.log(collapsed);
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
      theme="light"
      collapsible
      collapsed={isExpand}
      style={{
        height: "100vh"
      }}
      onCollapse={onCollapse}
    >
      <div className="logo" />
      <Menu
        theme="light"
        mode="inline"
        onSelect={selectedKeys => {
          console.log(selectedKeys);
        }}
        style={{ height: "100%" }}
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
