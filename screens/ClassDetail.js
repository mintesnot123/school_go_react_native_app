import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
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

const BASE_SIZE = argonTheme2.SIZES.BASE;
const GRADIENT_BLUE = ["#6B84CA", "#8F44CE"];
const GRADIENT_PINK = ["#D442F8", "#B645F5", "#9B40F8"];
const COLOR_WHITE = argonTheme2.COLORS.WHITE;
const COLOR_GREY = argonTheme2.COLORS.MUTED; // '#D8DDE1';

const ClassDetail = ({ navigation, route }) => {
  const { user, loaded, language, changeLanguage } = useContext(AuthContext);
  const class_id = route.params.class_id;

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

  const onAddAttendance = () => {
    firebase
      .takeAttendanceByTeacher(attendanceFields, class_id)
      .then((result) => {
        //console.log("result: ", result);
        setResult({
          state: "success",
          message: "Attendance added successfully",
        });
        loadData();
        //clearStates();
        //navigation.navigate("class_detail", { class_id: class_id });
      })
      .catch((error) => {
        console.log("error: ", error);
        setResult({
          state: "error",
          message: error.message
            ? error.message
            : "Something went wrong while adding attendance!",
        });
      });
  };
  const onAttendanceFieldsChange = (student_id) => {
    setAttendanceFields({
      ...attendanceFields,
      [student_id]: !attendanceFields[student_id],
    });
  };

  const dataParse = (data) => {
    return data;
  };
  const dataParse2 = (data) => {
    console.log("dataa", data);
    if (data) {
      return Object.keys(data).map((key) => {
        return {
          check_in: Object.keys(data[key].attendance).filter(
            (keyValue) => data[key].attendance[keyValue]
          ).length,
          absent: Object.keys(data[key].attendance).filter(
            (keyValue) => !data[key].attendance[keyValue]
          ).length,
          time: `${data[key].time.toDate().toTimeString()}`,
          date: ` ${data[key].time.toDate().toDateString()}`,
          attendance: data[key].attendance,
        };
      });
    } else {
      return [];
    }
  };
  const dataParse3 = (data) => {
    let newData = {};
    Object.keys(data.students).map((key) => {
      newData[key] = true;
    });
    return newData;
  };
  const loadData = () => {
    setLoading(true);
    firebase
      .getClassStudents(class_id)
      .then((response) => {
        setAttendanceFields(dataParse3(response.data()));
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
      .getCurrentTeacherAttendance(class_id)
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

  const renderStudentForAttendance = (data, index) => {
    const gradientColors = index % 2 ? GRADIENT_BLUE : GRADIENT_PINK;
    return (
      <>
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
              source={{ uri: data.image }}
              style={{ width: 60, height: 60 }}
            />
          </Gradient>

          <Block flex>
            <Text size={BASE_SIZE * 1.125}>{data.name}</Text>
            <Text size={BASE_SIZE * 0.875} muted>
              {`${language === "bah" ? "Gred" : "Grade"} ${data.grade}`}
            </Text>
          </Block>
          <Block style={styles.right}>
            <Switch
              value={attendanceFields[data.id]}
              onChange={() => {
                onAttendanceFieldsChange(data.id);
              }}
            />
          </Block>
        </Block>
      </>
    );
  };
  const renderStudentsForAttendance = (students) => {
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
      return (
        <>
          <Block shadow center flex style={{ marginTop: 10, marginBottom: 10 }}>
            <Text h6>
              {language === "bah" ? "Ambil Kehadiran" : "Take Attendance"}
            </Text>
          </Block>
          {studentKeys.map((key, index) =>
            renderStudentForAttendance(
              { ...students.students[key], id: key },
              index
            )
          )}
        </>
      );
    }
  };

  const renderAttendance = (data, index) => {
    const gradientColors = index % 2 ? GRADIENT_BLUE : GRADIENT_PINK;
    return (
      <Block
        row
        center
        card
        shadow
        space="between"
        style={styles.card}
        key={`attendance ${index}`}
      >
        <Block flex>
          <Text size={BASE_SIZE * 1.125}>{data.time.split(" ")[0]}</Text>
          <Text size={BASE_SIZE * 0.875} muted>
            {data.date}
          </Text>
        </Block>
        <Block flex style={styles.right}>
          <Text size={BASE_SIZE * 1.125}>{`${data.check_in} ${
            language === "bah" ? "Daftar masuk" : "Checked in"
          }`}</Text>
          <Text size={BASE_SIZE * 0.875} muted>
            {`${data.absent} ${language === "bah" ? "tidak hadir" : "Absent"}`}
          </Text>
        </Block>
      </Block>
    );
  };
  const renderAttendances = (attendances) => {
    if (attendances.length === 0) {
      return (
        <Block shadow center flex style={{ marginTop: 20 }}>
          <Text h6>
            {language === "bah"
              ? "Tiada kehadiran ditambah!"
              : "No attendance added!"}
          </Text>
        </Block>
      );
    } else {
      return (
        <>
          <Block shadow center flex style={{ marginTop: 10, marginBottom: 10 }}>
            <Text h6>
              {language === "bah" ? "Semua Kehadiran" : "All Attendances"}
            </Text>
          </Block>
          {attendances.map((attendance, index) =>
            renderAttendance(attendance, index)
          )}
        </>
      );
    }
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
        title={language === "bah" ? "Papan Pemuka Guru" : "Teachers Dashboard"}
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
          name: language === "bah" ? "Kehadiran" : "Attendance",
          onOptionPressed: () => setCurrentPage("attendance"),
          active: currentPage === "attendance",
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
          {apiData2.data ? (
            <>
              <ScrollView contentContainerStyle={styles.cards}>
                <Block flex space="between" style={{ marginTop: 20 }}>
                  {renderAttendances(apiData2.data)}
                </Block>
                <Block flex space="between" style={{ marginVertical: 20 }}>
                  {renderStudentsForAttendance(apiData.data)}
                </Block>
              </ScrollView>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  left: 30,
                  bottom: 30,
                }}
                onPress={handleAddStudent}
              >
                <Button style={styles.button} round onPress={onAddAttendance}>
                  {language === "bah" ? "Ambil Kehadiran" : "Take Attendance"}
                </Button>
              </TouchableOpacity>
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
                    ? "Memuatkan kehadiran"
                    : "Loading attendances"
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
