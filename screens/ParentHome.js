import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import {
  Block,
  theme,
  Text,
  Button,
  Card as GalioCard,
  Switch,
} from "galio-framework";
import { AuthContext } from "../firebase/context";
import EditParentProfile from "./EditParentProfile";

import { Card, Header } from "../components";

const { width } = Dimensions.get("screen");

import argonTheme2 from "./theme";
import firebase from "../firebase/firebase";
import { useIsFocused } from "@react-navigation/native";

import { Defs, LinearGradient, Stop } from "react-native-svg";
import ProgressDialog from "react-native-progress-dialog";

const BASE_SIZE = argonTheme2.SIZES.BASE;
const GRADIENT_BLUE = ["#6B84CA", "#8F44CE"];
const GRADIENT_PINK = ["#D442F8", "#B645F5", "#9B40F8"];
const COLOR_WHITE = argonTheme2.COLORS.WHITE;
const COLOR_GREY = argonTheme2.COLORS.MUTED; // '#D8DDE1';

const ClassDetail = ({ navigation, route }) => {
  const { user, loaded, language, changeLanguage } = useContext(AuthContext);
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
  const [attendanceFields, setAttendanceFields] = useState({});
  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurrentPage] = useState("students");
  const onSearchKeyChange = (text) => {
    setSearchKey(text);
  };
  const [result, setResult] = useState({
    state: "success",
    message: "",
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
      .getCurrentParent()
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
    setLoading2(true);
    try {
      const snapshot = await firebase.getParentStudents();
      const classes = [];
      snapshot.forEach((doc) => classes.push({ id: doc.id, ...doc.data() }));
      console.log("classes", classes);
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

  const renderStudent = (card, index) => {
    return (
      <TouchableNativeFeedback
        onPress={() => {
          handleGotoStudentDetail(card.id);
          console.log("card click with id:", card.id);
        }}
      >
        <GalioCard
          key={`card-${card.id}`}
          flex
          borderless
          shadowColor={argonTheme2.COLORS.BLACK}
          titleColor={card.full ? argonTheme2.COLORS.WHITE : null}
          style={styles.cardMain}
          title={card.name}
          caption={`${language === "bah" ? "Gred" : "Grade"} ${card.grade}`}
          location={`${language === "bah" ? "Bahagian" : "Section"} ${
            card.section
          }`}
          avatar={`${card.image}?${card.id}`}
          //image={card.image}
          imageStyle={[card.padded ? styles.rounded : null]}
          imageBlockStyle={[
            card.padded ? { padding: argonTheme2.SIZES.BASE / 2 } : null,
            card.full ? null : styles.noRadius,
          ]}
          footerStyle={card.full ? styles.full : null}
        >
          {card.full ? (
            <LinearGradient
              colors={["transparent", "rgba(0,0,0, 0.8)"]}
              style={styles.gradientMain}
            />
          ) : null}
        </GalioCard>
      </TouchableNativeFeedback>
    );
  };
  const renderStudents = (students) => {
    if (students.length === 0) {
      return (
        <Block shadow center flex style={{ marginTop: 20 }}>
          <Text h6>
            {language === "bah"
              ? "Belum ada pelajar yang ditambahkan pada anak anda!"
              : "No student added to your childs yet!"}
          </Text>
        </Block>
      );
    } else {
      return students.map((student, index) =>
        renderStudent({ ...student }, index)
      );
    }
  };
  console.log("apiData", apiData);
  const handleGotoStudentDetail = (student_id) =>
    navigation.navigate("student_detail_parent", { student_id: student_id });

  useEffect(() => {
    if (isFocused) {
      loadData();
      loadData2();
    }
  }, [isFocused]);
  return (
    <>
      <Header
        title={
          language === "bah" ? "Papan Pemuka Ibu Bapa" : "Parent Dashboard"
        }
        search
        onSearchTextChange={onSearchKeyChange}
        searchHint={
          currentPage === "students"
            ? language === "bah"
              ? "Cari anak"
              : "Search child"
            : language === "bah"
            ? "Cari guru"
            : "Search teachers"
        }
        options
        optionLeft={{
          name: language === "bah" ? "Kanak-kanak" : "Childs",
          onOptionPressed: () => setCurrentPage("students"),
          active: currentPage === "students",
        }}
        optionRight={{
          name: language === "bah" ? "Profil" : "Profile",
          onOptionPressed: () => setCurrentPage("attendance"),
          active: currentPage === "attendance",
        }}
        navigation={navigation}
      />
      {currentPage === "students" ? (
        <Block flex center style={styles.home}>
          {apiData2.data ? (
            <>
              <ScrollView contentContainerStyle={styles.cards}>
                <Block flex space="between" style={{ marginVertical: 20 }}>
                  {renderStudents(apiData2.data)}
                </Block>
              </ScrollView>
            </>
          ) : apiData2.message && apiData2.message !== "" ? (
            <Block shadow center flex style={{ marginTop: 20 }}>
              <Text h6>Error: {apiData2.message}</Text>
            </Block>
          ) : (
            <Block shadow center flex style={{ marginTop: 20 }}>
              <ProgressDialog
                visible={loading2}
                label={
                  language === "bah"
                    ? "Memuatkan kanak-kanak"
                    : "Loading childs"
                }
              />
            </Block>
          )}
        </Block>
      ) : (
        <>
          {apiData.data ? (
            <>
              <EditParentProfile
                profile={apiData.data}
                setCurrentPage={setCurrentPage}
                loadData={loadData}
                language={language}
              />
            </>
          ) : apiData.message && apiData.message !== "" ? (
            <Block shadow center flex style={{ marginTop: 20 }}>
              <Text h6>Error: {apiData.message}</Text>
            </Block>
          ) : (
            <Block shadow center flex style={{ marginTop: 20 }}>
              <ProgressDialog
                visible={true}
                label={
                  language === "bah" ? "Memuatkan profil" : "Loading profile"
                }
              />
            </Block>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
  card: {
    borderColor: "transparent",
    marginHorizontal: BASE_SIZE,
    marginVertical: BASE_SIZE / 2,
    padding: BASE_SIZE,
    backgroundColor: COLOR_WHITE,
    shadowOpacity: 0.4,
  },
  menu: {
    width: BASE_SIZE * 2,
    borderColor: "transparent",
  },
  settings: {
    width: BASE_SIZE * 2,
    borderColor: "transparent",
  },
  left: {
    marginRight: BASE_SIZE,
  },
  right: {
    width: BASE_SIZE * 2,
    backgroundColor: "transparent",
    elevation: 0,
  },
  gradient: {
    width: BASE_SIZE * 3.25,
    height: BASE_SIZE * 3.25,
    borderRadius: BASE_SIZE * 3.25,
    alignItems: "center",
    justifyContent: "center",
  },

  cards: {
    width,
    //backgroundColor: argonTheme2.COLORS.WHITE,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cardMain: {
    backgroundColor: argonTheme2.COLORS.WHITE,
    width: width - argonTheme2.SIZES.BASE * 2,
    marginVertical: argonTheme2.SIZES.BASE * 0.275,
    elevation: argonTheme2.SIZES.BASE / 2,
  },
  full: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
  },
  noRadius: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  rounded: {
    borderRadius: argonTheme2.SIZES.BASE * 0.1875,
  },
  gradientMain: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    position: "absolute",
    overflow: "hidden",
    borderBottomRightRadius: argonTheme2.SIZES.BASE * 0.5,
    borderBottomLeftRadius: argonTheme2.SIZES.BASE * 0.5,
  },
});

export default ClassDetail;
