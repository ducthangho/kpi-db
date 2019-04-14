import React, {    
    useState,
    useEffect,
    useContext,
    useRef
} from "react";

// import styled from "styled-components";
// import { size } from "styled-theme";
import { getState, getStore } from "state";
import { Switch, Row, Col, Typography, Layout, Input,Divider,Radio } from "antd";
// import intl from 'react-intl-universal';


import {
    observer, Observer    
} from 'mobx-react-lite';

import {BannerImg} from "components/icons";


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

// const getCurrentLocale = () => {
//   const currentLocale = intl.determineLocale({ urlLocaleKey: "lang", cookieLocaleKey: "lang" });
//   const checkedLocale = SUPPOER_LOCALES.filter(locale => currentLocale == locale.value);
//   if (checkedLocale.length > 0)
//     return currentLocale;
//   else
//     location.search = `?lang=${SUPPOER_LOCALES[0].value}`;
// };


const MainHeader = observer(props => {
  const [dashboard, dispatch] = getState();
  const [loaded, setLoaded] = useState(false);
  const store = useContext(PBIStore);
  // const intl = store.locales.obj;
  // const currentLocale = getCurrentLocale();  
  // console.log('CURRENT LOCALE',currentLocale);
  
  // autorun((reation) => {
  //   console.log('Caught ',store.getTitle);
  //   reation.dispose();
  // });
  
  // const initDone = store.locales.initDone;
    
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
    // location.search = `?lang=${lang}`;
    console.log('onSelectLocale ',lang);
    store.changeLanguage(lang);
  }


  if (!store.locales.initDone) store.changeLanguage();

  return (
    <Header style={{ background: "#21224d", padding: 0, height: 50, margin: 0 }}>
      <Row style={{ background: "#21224d", padding: 0, height: 50, margin: -5 }} type="flex" justify="center">
        <Col span={9}>
          <Title
            level={3}
            style={{
              margin: 0,              
              paddingLeft: 30,
              paddingTop: 10,
              color: "white",
              height: 50,
              textAlign: 'left',
              verticalAlign: 'middle',
            }}
          >
            {store.Title}
          </Title>
        </Col>

        <Col span={4} >
          <Radio.Group defaultValue={store.language} onChange={onSelectLocale} buttonStyle="solid" style={{verticalAlign: 'middle'}}>
            {SUPPOER_LOCALES.map(locale => (
              <Radio.Button key={locale.value} value={locale.value} style={{ margin:0,padding:5}} >{locale.name}</Radio.Button>
            ))}
          </Radio.Group>
        </Col>

        
        <Col span={11}>
        <Title style={{
          fontFamily: 'SegoeUI',
          fontSize: '20px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          fontStretch: 'normal',
          lineHeight: 'normal',
          letterSpacing: 'normal',
          color: '#f5c923',
          margin:0,
          verticalAlign: 'middle',
          textAlign: 'right',
          paddingRight: 50
        }}>          
          <img style={{ paddingRight: 40, height: 30,margin:15, verticalAlign: 'middle', algin:'middle' }} src={BannerImg}/> {store.text.get("BANNER_TITLE")}
        </Title>

        </Col>
        
      </Row>
    </Header>
  );
});

export default MainHeader;
