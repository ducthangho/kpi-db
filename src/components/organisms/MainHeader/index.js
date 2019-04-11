import React, {    
    useState,
    useContext    
} from "react";

// import styled from "styled-components";
// import { size } from "styled-theme";
import { getState, getStore } from "../../../state";
import { Switch, Row, Col, Typography, Layout, Input,Divider } from "antd";
import intl from 'react-intl-universal';
import {
    observer,    
} from 'mobx-react-lite';

const Search = Input.Search;
const { Header } = Layout;
const { Title } = Typography;

const PBIStore = getStore();

const MainHeader = observer(props => {
  const [dashboard, dispatch] = getState();
  const [loaded, setLoaded] = useState(false);
  const store = useContext(PBIStore);
  
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
    dispatch({
      type: "toggleDrawer",
      showDrawer: true
    });
  };

  return (
    <Header style={{ background: "#21224d", padding: 0, height: 50, margin: 0 }}>
      <Row style={{ background: "#21224d", padding: 0, height: 50, margin: 0 }}>
        <Col span={6}>
          <Title
            level={3}
            style={{
              margin: 0,
              borderRight: "#ccc 2px solid",
              paddingLeft: 30,
              paddingTop: 5,
              color: "white",
              height: 50
            }}
          >
            Tăng trưởng kinh tế
          </Title>
        </Col>
        <Col>
        <Title style={{
          fontFamily: 'SegoeUI',
          fontSize: '20px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          fontStretch: 'normal',
          lineHeight: 'normal',
          letterSpacing: 'normal',
          color: '#f5c923'
        }}>          
          <span>{intl.get("BANNER_TITLE")}</span>
        </Title>

        </Col>
      </Row>
    </Header>
  );
});

export default MainHeader;
