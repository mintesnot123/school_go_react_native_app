import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Block, theme } from "galio-framework";

import { Card } from "../components";
import articles from "../constants/articles";
const { width } = Dimensions.get("screen");
import Icon from "../components/Icon";
import argonTheme from "../constants/Theme";
import argonTheme2 from "./theme";

class Home extends React.Component {
  renderArticles = () => {
    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.articles}
        >
          <Block flex>
            <Card item={articles[0]} horizontal />
            <Block flex row>
              <Card
                item={articles[1]}
                style={{ marginRight: theme.SIZES.BASE }}
              />
              <Card item={articles[2]} />
            </Block>
            <Card item={articles[3]} horizontal />
            <Card item={articles[4]} full />
          </Block>
        </ScrollView>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            position: "absolute",
            bottom: 30,
            right: 30,
            height: 70,
            backgroundColor: argonTheme2.COLORS.INFO,
            borderRadius: 100,
          }}
        >
          {/* <Icon name="plus" size={30} color="#01a699" /> */}
          <Icon
            family="ArgonExtra"
            size={20}
            name="basket"
            color={argonTheme2.COLORS.WHITE}
          />
        </TouchableOpacity>
      </>
    );
  };

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderArticles()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
});

export default Home;
