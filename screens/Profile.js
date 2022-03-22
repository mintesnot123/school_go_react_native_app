import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Block, Text, Card, theme, Icon } from "galio-framework";

import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import firebase from "../firebase/firebase";
import { AuthContext } from "../firebase/context";
import { useIsFocused } from "@react-navigation/native";
import ProgressDialog from "react-native-progress-dialog";
import {
  messageTelegram,
  callNumber,
  sendEmail,
  textNumber,
} from "../utils/PhoneCall";

import theme2 from "./theme";
import { isDisabled } from "react-native/Libraries/LogBox/Data/LogBoxData";
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

const Profile = ({ navigation, route }) => {
  const { user, loaded, language, changeLanguage } = useContext(AuthContext);
  const student_id = route.params.student_id;

  const isFocused = useIsFocused();
  const [apiData, setApiData] = useState({
    state: "success",
    message: "",
    data: null,
  });
  const [apiData2, setApiData2] = useState({
    state: "success",
    message: "",
    data: null,
  });
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const dataParse = (data) => {
    return data;
  };
  const dataParse2 = (data) => {
    return data;
  };
  const loadData = () => {
    setLoading(true);
    firebase
      .getStudent(student_id)
      .then((response) => {
        setApiData({
          state: "success",
          message: "",
          data: dataParse(response.data()),
        });
        setLoading(false);
      })
      .catch((error) => {
        setApiData({
          state: "error",
          message: error.message,
          data: null,
        });
        setLoading(false);
      });
  };

  const loadData2 = async () => {
    setLoading(true);
    try {
      const snapshot = await firebase.getStudentParents(student_id);
      const classes = [];
      snapshot.forEach((doc) => classes.push({ id: doc.id, ...doc.data() }));
      setApiData2({
        state: "success",
        message: "",
        data: dataParse2(classes),
      });
      setLoading2(false);
    } catch (error) {
      setApiData2({
        state: "error",
        message: error.message,
        data: null,
      });
      setLoading2(false);
    }
  };

  console.log("apiData2", apiData2);
  useEffect(() => {
    if (isFocused) {
      loadData();
      loadData2();
    }
  }, [isFocused]);
  return (
    <Block flex style={styles.profile}>
      {apiData.data && apiData2.data ? (
        <Block flex>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: "5%" }}
            >
              <Block flex style={styles.profileCard}>
                <Block middle style={styles.avatarContainer}>
                  <Image
                    source={{
                      uri: apiData.data.image || Images.ProfilePicture,
                    }}
                    style={styles.avatar}
                  />
                </Block>
                <Block style={styles.info}>
                  <Block
                    middle
                    row
                    space="evenly"
                    style={{ marginTop: 20, paddingBottom: 24 }}
                  >
                    <Button
                      small
                      style={{ backgroundColor: argonTheme.COLORS.INFO }}
                    >
                      {language === "bah" ? "PANGGILAN" : "CALL"}
                    </Button>
                    <Button
                      small
                      style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
                    >
                      {language === "bah" ? "MESEJ" : "MESSAGE"}
                    </Button>
                  </Block>
                  <Block row space="between">
                    <Block middle>
                      <Text
                        bold
                        size={18}
                        color="#525F7F"
                        style={{ marginBottom: 4 }}
                      >
                        10
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>
                        {language === "bah" ? "Daftar masuk" : "Checkin"}
                      </Text>
                    </Block>
                    <Block middle>
                      <Text
                        bold
                        color="#525F7F"
                        size={18}
                        style={{ marginBottom: 4 }}
                      >
                        3
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>
                        {language === "bah" ? "tidak hadir" : "Absent"}
                      </Text>
                    </Block>
                    <Block middle>
                      <Text
                        bold
                        color="#525F7F"
                        size={18}
                        style={{ marginBottom: 4 }}
                      >
                        2
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>
                        {language === "bah" ? "pangkat" : "Rank"}
                      </Text>
                    </Block>
                  </Block>
                </Block>
                <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D">
                      {apiData.data.name || "Student"}
                    </Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      {`${language === "bah" ? "Gred" : "Grade"} ${
                        apiData.data.grade
                      }, ${language === "bah" ? "Bahagian" : "Section"} ${
                        apiData.data.section
                      }`}
                    </Text>
                  </Block>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>
                  <Block middle>
                    <Text
                      size={16}
                      color="#525F7F"
                      style={{ textAlign: "center" }}
                    >
                      {apiData.data.description}
                    </Text>
                    <Button style={{ marginTop: 30 }}>
                      {language === "bah" ? "Tunjukkan lagi" : "Show more"}
                    </Button>
                  </Block>
                </Block>
              </Block>
              <Block flex style={styles.profileCard2}>
                <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D">
                      {language === "bah"
                        ? "Maklumat Ibu Bapa"
                        : "Parents Info"}
                    </Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      {language === "bah"
                        ? "Semua kenalan ibu bapa ada di sini!"
                        : "All parents contact is here!"}
                    </Text>
                  </Block>
                  {apiData2.data.map((parent, index) => {
                    return (
                      <>
                        <Block center>
                          <Card
                            borderless
                            style={styles.stats}
                            title={parent.name || `Parent ${index + 1}`}
                            caption="139 minutes ago"
                            avatar={
                              parent.image ||
                              "http://i.pravatar.cc/100?id=article"
                            }
                            location={
                              <Block row right>
                                <TouchableOpacity
                                  onPress={() => {
                                    callNumber(
                                      parent.profile && parent.profile.phone
                                        ? parent.profile.phone
                                        : ""
                                    );
                                  }}
                                  disabled={
                                    parent.profile && parent.profile.phone
                                      ? false
                                      : true
                                  }
                                >
                                  <Block
                                    row
                                    middle
                                    style={{
                                      marginHorizontal: theme2.SIZES.BASE * 0.4,
                                    }}
                                  >
                                    <Icon
                                      name="call"
                                      family="ionicons"
                                      color={
                                        parent.profile && parent.profile.phone
                                          ? theme2.COLORS.SUCCESS
                                          : theme2.COLORS.MUTED
                                      }
                                      size={theme2.SIZES.FONT * 1.5}
                                    />
                                  </Block>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    textNumber(
                                      parent.profile && parent.profile.phone
                                        ? parent.profile.phone
                                        : ""
                                    );
                                  }}
                                  disabled={
                                    parent.profile && parent.profile.phone
                                      ? false
                                      : true
                                  }
                                >
                                  <Block
                                    row
                                    middle
                                    style={{
                                      marginHorizontal: theme2.SIZES.BASE * 0.4,
                                    }}
                                  >
                                    <Icon
                                      name="message1"
                                      family="AntDesign"
                                      color={
                                        parent.profile && parent.profile.phone
                                          ? theme2.COLORS.FACEBOOK
                                          : theme2.COLORS.MUTED
                                      }
                                      size={theme2.SIZES.FONT * 1.3}
                                    />
                                  </Block>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    messageTelegram(
                                      parent.profile && parent.profile.telegram
                                        ? parent.profile.telegram
                                        : ""
                                    );
                                  }}
                                  disabled={
                                    parent.profile && parent.profile.telegram
                                      ? false
                                      : true
                                  }
                                >
                                  <Block
                                    row
                                    middle
                                    style={{
                                      marginHorizontal: theme2.SIZES.BASE * 0.4,
                                    }}
                                  >
                                    <Icon
                                      name="sc-telegram"
                                      family="Evilicons"
                                      color={
                                        parent.profile &&
                                        parent.profile.telegram
                                          ? theme2.COLORS.SUCCESS
                                          : theme2.COLORS.MUTED
                                      }
                                      size={theme2.SIZES.FONT * 2}
                                    />
                                  </Block>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    sendEmail(parent.email || "");
                                  }}
                                  disabled={parent.email ? false : true}
                                >
                                  <Block row middle>
                                    <Icon
                                      name="email"
                                      family="MaterialIcons"
                                      color={
                                        parent.email
                                          ? theme2.COLORS.ERROR
                                          : theme2.COLORS.MUTED
                                      }
                                      size={theme2.SIZES.FONT * 1.5}
                                    />
                                  </Block>
                                </TouchableOpacity>
                              </Block>
                            }
                          />
                        </Block>
                        <ScrollView>
                          <Text style={styles.text}>
                            {`${language === "bah" ? "e-mel: " : "Email: "} ${
                              parent.email || "not found"
                            }`}
                          </Text>
                          <Text style={styles.text}>
                            {`${
                              language === "bah"
                                ? "Nombor telefon: "
                                : "Phone Number: "
                            } ${
                              parent.profile && parent.profile.phone
                                ? parent.profile.phone
                                : "not found"
                            }`}
                          </Text>
                        </ScrollView>
                        <Block
                          middle
                          style={{ marginTop: 30, marginBottom: 16 }}
                        >
                          <Block style={styles.divider} />
                        </Block>
                      </>
                    );
                  })}
                </Block>
              </Block>
            </ScrollView>
          </ImageBackground>
        </Block>
      ) : apiData.message && apiData.message !== "" ? (
        <Block shadow center flex style={{ marginTop: 20 }}>
          <Text h6>Error: {apiData.message}</Text>
        </Block>
      ) : (
        <Block shadow center flex style={{ marginTop: 20 }}>
          <ProgressDialog
            visible={loading}
            label={
              language === "bah"
                ? "Memuatkan data pelajar"
                : "Loading student data"
            }
          />
        </Block>
      )}
    </Block>
  );
};

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width: width,
    height: height / 2,
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: "60%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  profileCard2: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: "5%",
    marginBottom: "35%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35,
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  stats: {
    borderWidth: 0,
    width: width - theme2.SIZES.BASE * 2,
    height: theme2.SIZES.BASE * 4,
    marginVertical: theme2.SIZES.BASE * 0.875,
  },
  text: {
    fontSize: theme2.SIZES.FONT * 0.875,
    lineHeight: theme2.SIZES.FONT * 1.25,
  },
});

export default Profile;
