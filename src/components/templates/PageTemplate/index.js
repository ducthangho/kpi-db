import React, { Children } from "react";
import styled, { css } from "styled-components";

import { MainSidebar, MainHeader } from "components";

import { Layout, Drawer, Card, Divider } from "antd";
const { Meta } = Card;

import "antd/dist/antd.css";
const { Content } = Layout;
import { getState } from "../../../state";

const PageTemplate = props => {
  const [{ dashboard,theme }, dispatch] = getState();

   return (
    <Layout>
      <MainSidebar />
      <Layout style={{ background: "#eee", padding: 0 }}>
        <MainHeader />
        <Content>{props.children}</Content>
      </Layout>
      <Drawer
        title="Please Select A Test"
        placement="left"
        closable={true}
        // visible={false}
        onClose={() =>
          dispatch({
            type: "toggleDrawer",
            showDrawer: false
          })
        }
        visible={dashboard.showDrawer}
        width="400"
      >
      hello
      </Drawer>
    </Layout>
  );
};

PageTemplate.propTypes = {};

export default PageTemplate;
