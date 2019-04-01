import React from "react";
import PropTypes from "prop-types";
import {
  ScrollView,
  Text,
  View,
  Platform,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { without } from "ramda";
import HTML from "react-native-render-html";
import Icon from "react-native-vector-icons/FontAwesome";

import {
  CoreComponents,
  colors,
} from "@pru-rt-internal/rnmobile-app-core-framework";

import styles from "./styles";
import { IGNORED_TAGS } from "react-native-render-html/src/HTMLUtils";

const { Header } = CoreComponents;

const tags = without(
  [
    "table",
    "caption",
    "col",
    "colgroup",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "tr",
  ],
  IGNORED_TAGS
);

const tableDefaultStyle = {
  flex: 1,
  justifyContent: "flex-start",
  borderWidth: 0.3,
};

const tableColumnStyle = {
  ...tableDefaultStyle,
  flexDirection: "column",
  alignItems: "stretch",
};

const tableRowStyle = {
  ...tableDefaultStyle,
  flexDirection: "row",
  alignItems: "stretch",
};

const tdStyle = {
  ...tableDefaultStyle,
  padding: 2,
};

const thStyle = {
  ...tdStyle,
  backgroundColor: "#CCCCCC",
  alignItems: "center",
};
const fontFamily = Platform.OS === "ios" ? "PruSansNormal" : "pru-regular";
const baseFontStyle = {
  fontFamily,
};
const renderers = {
  table: (x, c) => <View style={tableColumnStyle}>{c}</View>,
  col: (x, c) => <View style={tableColumnStyle}>{c}</View>,
  colgroup: (x, c) => <View style={tableRowStyle}>{c}</View>,
  tbody: (x, c) => <View style={tableColumnStyle}>{c}</View>,
  tfoot: (x, c) => <View style={tableRowStyle}>{c}</View>,
  th: (x, c) => <View style={thStyle}>{c}</View>,
  thead: (x, c) => <View style={tableRowStyle}>{c}</View>,
  caption: (x, c) => <View style={tableColumnStyle}>{c}</View>,
  tr: (x, c) => <View style={tableRowStyle}>{c}</View>,
  td: (x, c) => <View style={tdStyle}>{c}</View>,
};

class Common extends React.Component {
  constructor() {
    super();
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    const { navigation } = this.props;
    navigation.goBack();
    return true;
  }

  render() {
    const { navigation } = this.props;
    const tagsStyles = {
      p: {
        fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
        marginVertical: 10,
        fontSize: 13.3,
      },
      span: {
        fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
        marginVertical: 10,
        fontSize: 13.3,
      },
      div: {
        fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
        marginVertical: 10,
        fontSize: 13.3,
      },
      strong: {
        fontFamily:
          Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-regular",
      },
      li: {
        fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
        fontSize: 13.3,
        //marginTop: -5,
      },
    };
    return (
      <View style={styles.container}>
        <Header
          style={{ paddingLeft: 0 }}
          leftIconType="back"
          onLeftPress={e => {
            e.preventDefault();
            navigation.goBack();
          }}
          onRightPress={() => console.log("Right button pressed")}
          showRightIcon={false}
        />
        <ScrollView
          style={styles.container}
          ref={scrollView => {
            this.scrollView = scrollView;
          }}
        >
          <Text style={styles.screenTitle}>
            {navigation.state.params.screenTitle}
          </Text>
          <HTML
            html={navigation.state.params.content}
            tagsStyles={tagsStyles}
            ignoredTags={tags}
            renderers={renderers}
            baseFontStyle={baseFontStyle}
          />
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            this.scrollView.scrollToEnd();
          }}
          style={styles.fixedIcon}
        >
          <Icon name="arrow-circle-down" size={30} color={colors.nevada} />
        </TouchableOpacity>
      </View>
    );
  }
}

Common.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Common;
