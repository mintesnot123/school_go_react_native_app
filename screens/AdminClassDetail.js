import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import {
  Block,
  theme,
  Text,
  Button,
  Card as GalioCard,
  Switch,
} from "galio-framework";

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
import SearchableDropdown from "react-native-searchable-dropdown";

const BASE_SIZE = argonTheme2.SIZES.BASE;
const GRADIENT_BLUE = ["#6B84CA", "#8F44CE"];
const GRADIENT_PINK = ["#D442F8", "#B645F5", "#9B40F8"];
const COLOR_WHITE = argonTheme2.COLORS.WHITE;
const COLOR_GREY = argonTheme2.COLORS.MUTED; // '#D8DDE1';

const teachersListGenerator = (items, classTeachers) => {
  const itemsVar1 = Object.keys(items).map((key) => {
    return {
      id: key,
      name: items[key].name,
    };
  });
  const itemsVar2 = itemsVar1.filter((newItem) => {
    return !classTeachers.includes(newItem.id);
  });
  return itemsVar2;
};

const AddTeacherForm = ({
  setSelectedTeachers,
  selectedTeachers,
  items,
  classTeachers,
  language,
}) => (
  <Block style={{ padding: argonTheme2.SIZES.BASE }}>
    <SearchableDropdown
      multi={true}
      selectedItems={selectedTeachers}
      onItemSelect={(item) => {
        console.log("item", item);
        const items = selectedTeachers;
        items.push(item);
        setSelectedTeachers(items);
      }}
      containerStyle={{ padding: 5 }}
      onRemoveItem={(item, index) => {
        const items = selectedTeachers.filter((sitem) => sitem.id !== item.id);
        setSelectedTeachers(items);
        //this.setState({ selectedItems: items });
      }}
      itemStyle={{
        padding: 10,
        marginTop: 2,
        backgroundColor: argonTheme2.COLORS.WHITE /* "#ddd" */,
        borderColor: argonTheme2.COLORS.BLACK /* "#bbb" */,
        borderWidth: 1,
        borderRadius: 5,
      }}
      itemTextStyle={{ color: "#222" }}
      itemsContainerStyle={{ maxHeight: 150 }}
      items={teachersListGenerator(items, classTeachers)}
      //defaultIndex={20}
      chip={true}
      resetValue={false}
      textInputProps={{
        placeholder: language === "bah" ? "Pilih guru" : "Select teacher",
        underlineColorAndroid: "transparent",
        //rounded: true,
        color: argonTheme2.COLORS.THEME,
        placeholderTextColor: argonTheme2.COLORS.THEME,

        style: {
          padding: 10,
          borderWidth: 1,
          borderRadius: 15,
          borderColor: argonTheme2.COLORS.THEME,
        },
      }}
      listProps={{
        nestedScrollEnabled: true,
      }}
    />
  </Block>
);

const ClassDetail = ({ navigation, route }) => {
  const { user, loaded, language, changeLanguage } = useContext(AuthContext);
  const class_id = route.params.class_id;

  const [selectedTeachers, setSelectedTeachers] = useState([]);

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
  const [apiData3, setApiData3] = useState({
    state: "success",
    message: "",
    data: null,
  });

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
  const [loading3, setLoading3] = useState(false);
  const [addingDeleting, setAddingDeleting] = useState(false);

  const handleSubmit = () => {
    if (selectedTeachers && selectedTeachers.length > 0) {
      setAddingDeleting(true);
      console.log("get firebase");
      console.log("selectedTeachers", selectedTeachers);
      firebase
        .addTeacherToClass(class_id, selectedTeachers)
        .then(() => {
          setSelectedTeachers([]);
          setAddingDeleting(false);
          loadData2();
          loadData3();
        })
        .catch((error) => {
          console.log(error);
          setAddingDeleting(false);
        });
    }
  };
  const onClickDelete = (id) => {
    setAddingDeleting(true);
    console.log("get firebase");
    console.log("selectedTeachers", id);
    firebase
      .removeTeacherFromClass(class_id, id)
      .then(() => {
        setAddingDeleting(false);
        loadData2();
        loadData3();
      })
      .catch((error) => {
        console.log(error);
        setAddingDeleting(false);
      });
  };

  const dataParse = (data) => {
    return data;
  };
  const dataParse2 = (data) => {
    return data;
  };
  const dataParse3 = (data) => {
    return data;
  };

  const loadData = () => {
    setLoading(true);
    firebase
      .getClassStudents(class_id)
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
  const loadData2 = () => {
    setLoading2(true);
    firebase
      .getClass(class_id)
      .then((response) => {
        setApiData2({
          state: "success",
          message: "",
          data: dataParse2(response.data()),
        });
        setLoading2(false);
      })
      .catch((error) => {
        setApiData2({
          state: "error",
          message: error.message,
          data: null,
        });
        setLoading2(false);
      });
  };
  const loadData3 = () => {
    setLoading3(true);
    firebase
      .getDocList("teachers")
      .then((response) => {
        setApiData3({
          state: "success",
          message: "",
          data: dataParse3(response.data()),
        });
        setLoading3(false);
      })
      .catch((error) => {
        setApiData3({
          state: "error",
          message: error.message,
          data: null,
        });
        setLoading3(false);
      });
  };
  console.log("apiData2vd", apiData3);
  const handleAddStudent = () =>
    navigation.navigate("add_student", { class_id: class_id });
  const handleGotoStudentDetail = (student_id) =>
    navigation.navigate("student_detail", { student_id: student_id });

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
    const studentKeys = Object.keys(students.students);
    if (studentKeys.length === 0) {
      return (
        <Block shadow center flex style={{ marginTop: 20 }}>
          <Text h6>
            {language === "bah"
              ? "Belum ada pelajar yang ditambahkan ke kelas ini!"
              : "No student added to this class yet!"}
          </Text>
        </Block>
      );
    } else {
      return studentKeys.map((key, index) =>
        renderStudent({ ...students.students[key], id: key }, index)
      );
    }
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
        <TouchableWithoutFeedback onPress={() => onClickDelete(data.id)}>
          <Icon
            name={"delete"}
            family="materialIcons"
            size={20}
            // onPress={this.handleLeftPress}
            color={argonTheme2.COLORS.ICON}
            style={{ marginTop: 2 }}
          />
        </TouchableWithoutFeedback>
      </Block>
    );
  };
  const renderTeachers = (datas, teacherLookup) => {
    const classTeachers = datas.teachers || [];

    return (
      <>
        <ScrollView
          style={{ flex: 1, marginTop: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {classTeachers.length === 0 ? (
            <Block
              shadow
              center
              flex
              style={{ marginTop: 20, marginBottom: 20 }}
            >
              <Text h6>
                {language === "bah"
                  ? "Belum ada guru yang ditambahkan ke kelas ini!"
                  : "No teacher added to this class yet!"}
              </Text>
            </Block>
          ) : (
            <>
              <>
                {classTeachers.map((teacherId, index) => {
                  const data = {
                    id: teacherId,
                    name: teacherLookup[teacherId].name,
                    email: teacherLookup[teacherId].email,
                    image: teacherLookup[teacherId].image,
                  };
                  return renderTeacherCard(data);
                })}
              </>
            </>
          )}
          <Block flex>
            <Text /* muted */ center size={theme.SIZES.FONT * 0.875}>
              {language === "bah" ? "Tambah Cikgu" : "Add Teacher"}
            </Text>
            <AddTeacherForm
              setSelectedTeachers={setSelectedTeachers}
              selectedTeachers={selectedTeachers}
              items={teacherLookup}
              classTeachers={classTeachers}
              language={language}
            />
          </Block>
          <Block flex style={{ marginBottom: theme.SIZES.BASE }}>
            <Block flex center style={{ padding: theme.SIZES.BASE }}>
              <Button style={styles.button} round onPress={handleSubmit}>
                {language === "bah" ? "Hantar" : "Submit"}
              </Button>
            </Block>
          </Block>
        </ScrollView>
      </>
    );
  };

  useEffect(() => {
    if (isFocused) {
      loadData();
      loadData2();
      loadData3();
    }
  }, [isFocused]);
  return (
    <>
      <Header
        title={
          language === "bah" ? "Papan Pemuka Pentadbir" : "Admin Dashboard"
        }
        search
        onSearchTextChange={onSearchKeyChange}
        searchHint={
          currentPage === "students"
            ? language === "bah"
              ? "Cari pelajar"
              : "Search students"
            : language === "bah"
            ? "Cari guru"
            : "Search teachers"
        }
        options
        optionLeft={{
          name: language === "bah" ? "pelajar" : "Students",
          onOptionPressed: () => setCurrentPage("students"),
          active: currentPage === "students",
        }}
        optionRight={{
          name: language === "bah" ? "guru-guru" : "Teachers",
          onOptionPressed: () => setCurrentPage("teachers"),
          active: currentPage === "teachers",
        }}
        navigation={navigation}
      />
      {currentPage === "students" ? (
        <Block flex center style={styles.home}>
          {apiData.data ? (
            <>
              <ScrollView contentContainerStyle={styles.cards}>
                <Block flex space="between" style={{ marginVertical: 20 }}>
                  {renderStudents(apiData.data)}
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
                onPress={handleAddStudent}
              >
                <Icon
                  family="Ionicons"
                  size={25}
                  name="add"
                  color={argonTheme2.COLORS.WHITE}
                />
              </TouchableOpacity>
            </>
          ) : apiData.message && apiData.message !== "" ? (
            <Block shadow center flex style={{ marginTop: 20 }}>
              <Text h6>Error: {apiData.message}</Text>
            </Block>
          ) : (
            <Block shadow center flex style={{ marginTop: 20 }}>
              <ProgressDialog
                visible={loading}
                label={
                  language === "bah" ? "Memuatkan pelajar" : "Loading students"
                }
              />
            </Block>
          )}
        </Block>
      ) : (
        <>
          {apiData2.data && apiData3.data ? (
            <>{renderTeachers(apiData2.data, apiData3.data)}</>
          ) : (apiData2.message && apiData2.message !== "") ||
            (apiData3.message && apiData3.message !== "") ? (
            <Block shadow center flex style={{ marginTop: 20 }}>
              <Text h6>Error: {apiData2.message || apiData3.message}</Text>
            </Block>
          ) : (
            <Block shadow center flex style={{ marginTop: 20 }}>
              <ProgressDialog
                visible={true}
                label={
                  language === "bah" ? "Memuatkan guru" : "Loading teachers"
                }
              />
            </Block>
          )}
          <ProgressDialog
            visible={addingDeleting}
            label={language === "bah" ? "Menyerahkan" : "Submiting"}
          />
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
