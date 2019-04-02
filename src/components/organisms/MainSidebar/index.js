import React, { useState } from "react";
import ReactDom from "react-dom";
import { Layout, Menu, Icon } from "antd";
import { injectGlobal } from "styled-components";
const { Sider } = Layout;
import { getState } from "../../../state";

injectGlobal`
#app .logo {
  height: 32px;
  background: rgba(255,255,255,.2);
  margin: 16px;
}
`;

function MainSidebar() {
  const [isExpand, setExpand] = useState(false);
  const [{ dashboard, theme }, dispatch] = getState();

  const onCollapse = collapsed => {
    console.log(collapsed);
    setExpand(collapsed);
  };

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
          onClick={() =>
            dispatch({
              type: "toggleDrawer",
              showDrawer: !dashboard.showDrawer
            })
          }
        >
          <Icon type="experiment" />
          <span>Select Demo</span>
        </Menu.Item>
        <Menu.Item
          selectable
          key="2"
          onClick={() => {
            const root = document.getElementById('app');
            ReactDom.unmountComponentAtNode(root);
            // alert("nothing..");
            // dispatch({
            //   type: "changePage",
            //   currentPage: 3 - edit_cesium.currentPage
            // })
          }}
        >
          <Icon type="reload" />
          <span>Refresh Demo</span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
export default MainSidebar;
