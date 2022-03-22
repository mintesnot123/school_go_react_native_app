import React from "react";
import { StyleSheet, Dimensions } from "react-native";
//galio
import { Block, Text, theme } from "galio-framework";
//argon
import { argonTheme } from "../constants/";

import ProgressDialog from "react-native-progress-dialog";

const { width } = Dimensions.get("screen");

class Articles extends React.Component {
  render() {
    return (
      <Block flex center styles={{ backgroundColor: argonTheme.COLORS.WHITE }}>
        <ProgressDialog visible={true} label="Check user" />
      </Block>
    );
  }
}

const styles = StyleSheet.create({});

export default Articles;
