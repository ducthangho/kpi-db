import React, {    
    useState,
    useContext    
} from "react";

// import styled from "styled-components";
// import { size } from "styled-theme";
import { getState, getStore } from "../../../state";
import { Switch, Row, Col, Typography, Layout, Input,Divider,Radio } from "antd";
import intl from 'react-intl-universal';

import BannerImg from "../../pages/MainPage/styles/ic-quoc-huy.png";

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
    <Header style={{ background: "#21224d", padding: 0, height: 50, margin: 0 }}>
      <Row style={{ background: "#21224d", padding: 0, height: 50, margin: 0 }}>
        <Col span={9}>
          <Title
            level={3}
            style={{
              margin: 0,              
              paddingLeft: 30,
              paddingTop: 5,
              color: "white",
              height: 50
            }}
          >
            Tăng trưởng kinh tế
          </Title>
        </Col>

        <Col span={9}>
          <Radio.Group defaultValue={currentLocale} onChange={onSelectLocale} buttonStyle="solid" style={{height:40, margin:0,padding:0}}>
            {SUPPOER_LOCALES.map(locale => (
              <Radio.Button key={locale.value} value={locale.value} style={{ margin:0,padding:5}} >{locale.name}</Radio.Button>
            ))}
          </Radio.Group>
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
          <span><img src={BannerImg}/></span><span>{intl.get("BANNER_TITLE")}</span>
        </Title>

        </Col>
        
      </Row>
    </Header>
  );
});

export default MainHeader;
