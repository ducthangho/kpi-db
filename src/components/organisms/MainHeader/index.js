import React, {    
    useState,
    useContext    
} from "react";

// import styled from "styled-components";
// import { size } from "styled-theme";
import { getState, getStore } from "../../../state";
import { Switch, Row, Col, Typography, Layout, Input } from "antd";
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
    //alert("onSearch 123");
    console.log(store.searchDrawer);
    store.showSearchDrawer();
    // let tabs = store.tabs.panes;
    //console.log('Tab length', tabs.length);
    // if (tabs.length==0){
    //   console.log('Adding tab');
    //   const key = "Tab1";
    //   store.setActiveKey(key);
    //   store.addTab({ title: 'New Tab', content: 'New Tab Pane', key: key });
    // }

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
            placeholder="Ask a question"
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
});

export default MainHeader;
