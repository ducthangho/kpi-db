import React from "react";
// import styled from "styled-components";
// import { size } from "styled-theme";
import { getState } from "../../../state";
import { Switch, Row, Col, Typography, Layout, Input } from "antd";

const Search = Input.Search;
const { Header } = Layout;
const { Title } = Typography;

const MainHeader = props => {
  const [dashboard, dispatch] = getState();

  const onShowColor = checked => {
    dispatch({
      type: "showColor",
      showColor: checked
    });
  };

  const onSearch = value => {
    dispatch({
      type: "doSearch",
      searchText: value
    });
  };

  return (
    <Header style={{ background: "#E0E0E0", padding: 0 }}>
      <Row>
        <Col span={6}>
          <Title
            level={3}
            style={{
              margin: 14,
              borderRight: "#ccc 2px solid",
              paddingLeft: 10
            }}
          >
            MY DASHBOARD
          </Title>
        </Col>
        <Col span={18}>
          <Search
            placeholder="Search Address.."
            onSearch={onSearch}
            style={{ width: 250, paddingTop: 14 }}
            enterButton
          />
          <span className="ant-divider" style={{ margin: "0 1em" }} />
          <strong>SHOW COLOR</strong> &nbsp;
          <Switch defaultChecked={dashboard.showColor} onChange={onShowColor} />
        </Col>
      </Row>
    </Header>
  );
};

export default MainHeader;
