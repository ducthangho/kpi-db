import React, {    
    useState,
    useContext    
} from "react";

// import styled from "styled-components";
// import { size } from "styled-theme";
import { getState, getStore } from "../../../state";
import { Switch, Row, Col, Typography, Layout, Input,Divider,Radio } from "antd";
//import intl from 'react-intl-universal';

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

const getCurrentLocale = () => {
  const currentLocale = intl.determineLocale({ urlLocaleKey: "lang", cookieLocaleKey: "lang" });
  const checkedLocale = SUPPOER_LOCALES.filter(locale => currentLocale == locale.value);
  if (checkedLocale.length > 0)
    return currentLocale;
  else
    location.search = `?lang=${SUPPOER_LOCALES[0].value}`;
};


const MainHeader = observer(props => {
  const [dashboard, dispatch] = getState();
  const [loaded, setLoaded] = useState(false);
  const store = useContext(PBIStore);
  const intl = store.locales.obj;
  const currentLocale = intl.determineLocale({ urlLocaleKey: "lang", cookieLocaleKey: "lang" });
  const checkedLocale = SUPPOER_LOCALES.filter(locale => currentLocale == locale.value);
  console.log('CURRENT LOCALE',currentLocale);
  const initDone = store.locales.initDone;
  if (!initDone){
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../../locales/${currentLocale}`)
      }
    })
    store.saveIntl(intl);
  }

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
      <Row style={{ background: "#21224d", padding: 0, height: 50, margin: -5 }} type="flex" justify="center" align="middle">
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

        <Col span={5} >
          <Radio.Group defaultValue={currentLocale} onChange={onSelectLocale} buttonStyle="solid">
            {SUPPOER_LOCALES.map(locale => (
              <Radio.Button key={locale.value} value={locale.value} style={{ margin:0,padding:5}} >{locale.name}</Radio.Button>
            ))}
          </Radio.Group>
        </Col>

        <Col span={1}>
        <img style={{ padding: 0, height: 30,margin:0 }} src={BannerImg}/>
        </Col>
        <Col span={9}>
        <Title style={{
          fontFamily: 'SegoeUI',
          fontSize: '20px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          fontStretch: 'normal',
          lineHeight: 'normal',
          letterSpacing: 'normal',
          color: '#f5c923',
          margin:0          
        }}>          
          {intl.get("BANNER_TITLE")}
        </Title>

        </Col>
        
      </Row>
    </Header>
  );
});

export default MainHeader;
