import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Block, theme, Text, Button } from "galio-framework";

import { Card, Header } from "../components";
import articles from "../constants/articles";
const { width } = Dimensions.get("screen");
import Icon from "../components/Icon";
import argonTheme from "../constants/Theme";
import argonTheme2 from "./theme";
import firebase from "../firebase/firebase";
import { AuthContext } from "../firebase/context";
import { useIsFocused } from "@react-navigation/native";

import { LinearGradient as Gradient } from "expo-linear-gradient";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import ProgressDialog from "react-native-progress-dialog";

const BASE_SIZE = argonTheme2.SIZES.BASE;
const GRADIENT_BLUE = ["#6B84CA", "#8F44CE"];
const GRADIENT_PINK = ["#D442F8", "#B645F5", "#9B40F8"];
const COLOR_WHITE = argonTheme2.COLORS.WHITE;
const COLOR_GREY = argonTheme2.COLORS.MUTED; // '#D8DDE1';

const AdminHome = ({ navigation }) => {
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
  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurrentPage] = useState("classes");

  const [isDeleting, setIsDeleting] = useState(false);

  const onClickDelete = (id) => {
    setIsDeleting(true);
    firebase
      .deleteClass(id)
      .then(() => {
        setIsDeleting(false);
        loadData();
      })
      .catch((error) => {
        console.log(error);
        setIsDeleting(false);
      });
  };
  const viewDetail = (id) => {    
    navigation.navigate("class_detail", { class_id: id });
  };

  const onSearchKeyChange = (text) => {
    setSearchKey(text);
  };
  const dataParse = (data) => {
    return data;
  };
  const dataParse2 = (data) => {
    return data;
  };

  const loadData = () => {
    firebase
      .getDocList("classes")
      .then((response) => {
        setApiData({
          state: "success",
          message: "",
          data: dataParse(response.data()),
        });
      })
      .catch((error) => {
        setApiData({
          state: "error",
          message: error.message,
          data: null,
        });
      });
  };
  const loadData2 = () => {
    firebase
      .getDocList("teachers")
      .then((response) => {
        setApiData2({
          state: "success",
          message: "",
          data: dataParse(response.data()),
        });
      })
      .catch((error) => {
        setApiData2({
          state: "error",
          message: error.message,
          data: null,
        });
      });
  };

  const handleAddClass = () => navigation.navigate("add_class");
  const handleAddTeacher = () => navigation.navigate("add_teacher");

  const groupData = (datas) => {
    const groupedData = [];
    let newData = [];
    let totalLength = Object.keys(datas).length;
    //console.log("datas", datas);
    Object.keys(datas).map((key, index) => {
      const data = {
        id: key,
        title: datas[key].name,
        image: datas[key].image,
        cta: language === "bah" ? "Lihat butiran" : "View detail",
        horizontal: true,
      };
      newData.push(data);
      if ((index + 1) % 5 === 0 || totalLength === index + 1) {
        groupedData.push(newData);
        newData = [];
      }
    });
    return groupedData;
  };
  const renderClasses = (datas) => {
    const groupedData = groupData(datas);
    //console.log("groupedData", groupedData);
    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.articles}
        >
          <Block flex>
            {groupedData.map((groupedDataVar, index) => {
              const dataLength = groupedDataVar.length;
              //console.log("new new", groupedDataVar);
              return (
                <>
                  {dataLength > 0 && (
                    <Card
                      item={groupedDataVar[0]}
                      horizontal
                      IconElement={
                        <Icon
                          name={"delete"}
                          family="materialIcons"
                          size={20}
                          // onPress={this.handleLeftPress}
                          color={argonTheme.COLORS.ICON}
                          style={{ marginTop: 2 }}
                        />
                      }
                      onClickIcon={() => onClickDelete(groupedDataVar[0].id)}
                      onClickDetail={() => viewDetail(groupedDataVar[0].id)}
                    />
                  )}
                  {dataLength > 1 && (
                    <Block flex row>
                      <Card
                        item={groupedDataVar[1]}
                        style={{ marginRight: theme.SIZES.BASE }}
                        IconElement={
                          <Icon
                            name={"delete"}
                            family="materialIcons"
                            size={20}
                            // onPress={this.handleLeftPress}
                            color={argonTheme.COLORS.ICON}
                            style={{ marginTop: 2 }}
                          />
                        }
                        onClickIcon={() => onClickDelete(groupedDataVar[1].id)}
                        onClickDetail={() => viewDetail(groupedDataVar[1].id)}
                      />
                      {dataLength > 2 && (
                        <Card
                          item={groupedDataVar[2]}
                          IconElement={
                            <Icon
                              name={"delete"}
                              family="materialIcons"
                              size={20}
                              // onPress={this.handleLeftPress}
                              color={argonTheme.COLORS.ICON}
                              style={{ marginTop: 2 }}
                            />
                          }
                          onClickIcon={() =>
                            onClickDelete(groupedDataVar[2].id)
                          }
                          onClickDetail={() => viewDetail(groupedDataVar[2].id)}
                        />
                      )}
                    </Block>
                  )}
                  {dataLength > 3 && (
                    <Card
                      item={groupedDataVar[3]}
                      horizontal
                      IconElement={
                        <Icon
                          name={"delete"}
                          family="materialIcons"
                          size={20}
                          // onPress={this.handleLeftPress}
                          color={argonTheme.COLORS.ICON}
                          style={{ marginTop: 2 }}
                        />
                      }
                      onClickIcon={() => onClickDelete(groupedDataVar[3].id)}
                      onClickDetail={() => viewDetail(groupedDataVar[3].id)}
                    />
                  )}
                  {dataLength > 4 && (
                    <Card
                      item={groupedDataVar[4]}
                      full
                      IconElement={
                        <Icon
                          name={"delete"}
                          family="materialIcons"
                          size={20}
                          // onPress={this.handleLeftPress}
                          color={argonTheme.COLORS.ICON}
                          style={{ marginTop: 2 }}
                        />
                      }
                      onClickIcon={() => onClickDelete(groupedDataVar[4].id)}
                      onClickDetail={() => viewDetail(groupedDataVar[4].id)}
                    />
                  )}
                </>
              );
            })}
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
          onPress={handleAddClass}
        >
          {/* <Icon name="plus" size={30} color="#01a699" /> */}
          <Icon
            family="Ionicons"
            size={25}
            name="add"
            color={argonTheme2.COLORS.WHITE}
          />
        </TouchableOpacity>
      </>
    );
  };

  const renderTeacherCard = (data, index) => {
    const gradientColors = index % 2 ? GRADIENT_BLUE : GRADIENT_PINK;

    return (
      <Block
        row
        center
        card
        shadow
        space="between"
        style={styles.card}
        key={data.id}
      >
        <Gradient
          start={[0.45, 0.45]}
          end={[0.9, 0.9]}
          colors={gradientColors}
          style={[styles.gradient, styles.left]}
        >
          <Image
            source={{
              uri:
                data.image ||
                "https://firebasestorage.googleapis.com/v0/b/schoolgo-19532.appspot.com/o/students%2FOQgbRiLQLgihwGWfnH8J?alt=media&token=9ee13f9c-497b-4e6b-850c-f83247ee59f0",
            }}
            style={{ width: 60, height: 60 }}
          />
        </Gradient>

        <Block flex>
          <Text size={BASE_SIZE * 1.125}>{data.name}</Text>
          <Text size={BASE_SIZE * 0.875} muted>
            {data.email}
          </Text>
        </Block>
      </Block>
    );
  };
  const renderTeachers = (datas) => {
    return (
      <>
        <ScrollView style={{ flex: 1, marginTop: 20 }}>
          {Object.keys(datas).map((key, index) => {
            const data = {
              id: key,
              name: datas[key].name,
              email: datas[key].email,
              image: datas[key].image,
            };
            return renderTeacherCard(data);
          })}
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
          onPress={handleAddTeacher}
        >
          <Icon
            family="Ionicons"
            size={25}
            name="add"
            color={argonTheme2.COLORS.WHITE}
          />
        </TouchableOpacity>
      </>
    );
  };

  useEffect(() => {
    if (isFocused) {
      loadData();
      loadData2();
    }
  }, [isFocused]);
  return (
    <>
      <Header
        title={language === "bah" ? "Papan Pemuka Pentadbir" : "Admin Dashboard"}
        search
        onSearchTextChange={onSearchKeyChange}
        //onSubmitSearchKey={}
        searchHint={
          currentPage === "classes" ? (language === "bah" ? "Cari kelas" : "Search classes") : (language === "bah" ? "Cari guru" : "Search teachers")
        }
        /* tabs={[
          { id: "s", title: "some" },
          { id: "o", title: "other" },
        ]} */
        options
        optionLeft={{
          name: language === "bah" ? "Kelas" : "Classes",
          onOptionPressed: () => setCurrentPage("classes"),
          active: currentPage === "classes",
        }}
        optionRight={{
          name: language === "bah" ? "guru-guru" : "Teachers",
          onOptionPressed: () => setCurrentPage("teachers"),
          active: currentPage === "teachers",
        }}
        navigation={navigation}
        //scene={scene}
      />
      {currentPage === "classes" ? (
        <Block flex center style={styles.home}>
          {apiData.data ? (
            <>{renderClasses(apiData.data)}</>
          ) : apiData.message && apiData.message !== "" ? (
            <Text h3>Error: {apiData.message}</Text>
          ) : (
            <ProgressDialog visible={true} label={language === "bah" ? "Memuatkan" : "Loading"} />
          )}
          <ProgressDialog visible={isDeleting} label={language === "bah" ? "Memadam kelas" : "Deleting class"} />
        </Block>
      ) : (
        <>
          {apiData2.data ? (
            <>{renderTeachers(apiData2.data)}</>
          ) : apiData2.message && apiData2.message !== "" ? (
            <Block shadow center flex style={{ marginTop: 20 }}>
              <Text h6>Error: {apiData2.message}</Text>
            </Block>
          ) : (
            <Block shadow center flex style={{ marginTop: 20 }}>
              <Text h3>{language === "bah" ? "Memuatkan..." : "Loading..."}</Text>
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
});

export default AdminHome;
