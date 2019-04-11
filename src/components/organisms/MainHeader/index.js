import React, {    
    useState,
    useContext    
} from "react";
import intl from 'react-intl-universal';
// import styled from "styled-components";
// import { size } from "styled-theme";
import { getState, getStore } from "../../../state";
import { Switch, Row, Col, Typography, Layout, Input, Radio } from "antd";
import {
    observer,    
} from 'mobx-react-lite';

const Search = Input.Search;
const { Header } = Layout;
const { Title } = Typography;

const PBIStore = getStore();

const SUPPOER_LOCALES = [
  {
    name: "English",
    value: "en-US"
  },
  {
    name: "Tiếng Việt",
    value: "vi-VN"
  },
  {
    name: "日本の",
    value: "ja-JP"
  }
];

const MainHeader = observer(props => {
  const [dashboard, dispatch] = getState();
  const [loaded, setLoaded] = useState(false);
  const store = useContext(PBIStore);
  const currentLocale = intl.determineLocale({ urlLocaleKey: "lang", cookieLocaleKey: "lang" });

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

  const onSelectLocale = (e) => {
    let lang = e.target.value;
    location.search = `?lang=${lang}`;
  }

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
        <Col span={9}>
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
        <Col span={9}>
          <Radio.Group defaultValue={currentLocale} onChange={onSelectLocale} buttonStyle="solid">
            {SUPPOER_LOCALES.map(locale => (
              <Radio.Button key={locale.value} value={locale.value}>{locale.name}</Radio.Button>
            ))}
          </Radio.Group>
        </Col>
      </Row>
    </Header>
  );
});

export default MainHeader;
