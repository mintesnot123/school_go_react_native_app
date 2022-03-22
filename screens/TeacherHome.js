import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { LinearGradient as Gradient } from "expo-linear-gradient";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import { Header } from "../components";
import { useIsFocused } from "@react-navigation/native";

// galio components
import { Button, Block, Icon, Text, NavBar, Card } from "galio-framework";
import theme from "./theme";
import firebase from "../firebase/firebase";
import { AuthContext } from "../firebase/context";
import ProgressDialog from "react-native-progress-dialog";

const BASE_SIZE = theme.SIZES.BASE;
const GRADIENT_BLUE = ["#6B84CA", "#8F44CE"];
const GRADIENT_PINK = ["#D442F8", "#B645F5", "#9B40F8"];
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

// mock data
const cards = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1494252713559-f26b4bf0b174?w=840&q=300",
    avatar: "http://i.pravatar.cc/100",
    title: "Christopher Moon",
    caption: "138 minutes ago",
    location: "Los Angeles, CA",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1503631285924-e1544dce8b28?&w=1200&h=1600&fit=crop&crop=entropy&q=300",
    avatar: "http://i.pravatar.cc/100",
    title: "Christopher Moon",
    caption: "138 minutes ago",
    location: "Los Angeles, CA",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1497802176320-541c8e8de98d?&w=1600&h=900&fit=crop&crop=entropy&q=300",
    avatar: "http://i.pravatar.cc/100",
    title: "Christopher Moon",
    caption: "138 minutes ago",
    location: "Los Angeles, CA",
    padded: true,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1490049350474-498de43bc885?&w=1600&h=900&fit=crop&crop=entropy&q=300",
    avatar: "http://i.pravatar.cc/100",
    title: "Christopher Moon",
    caption: "138 minutes ago",
    location: "Los Angeles, CA",
    padded: true,
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1493612216891-65cbf3b5c420?&w=1500&h=900&fit=crop&crop=entropy&q=300",
    avatar: "http://i.pravatar.cc/100",
    title: "Christopher Moon",
    caption: "138 minutes ago",
    full: true,
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1506321806993-0e39f809ae59?&w=1500&h=1900&fit=crop&crop=entropy&q=300",
    avatar: "http://i.pravatar.cc/100",
    title: "Christopher Moon",
    caption: "138 minutes ago",
    full: true,
  },
];
const statsTitles = ["Jul", "Aug", "Sep", "Oct", "Nov"];

const TeacherHome = ({ navigation }) => {
  const { user, loaded, language, changeLanguage } = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [searchKey, setSearchKey] = useState("");
  const onSearchKeyChange = (text) => {
    setSearchKey(text);
  };
  const [loading, setLoading] = useState(false);
  const onClickViewDetail = (id) => {
    navigation.navigate("class_detail", { class_id: id });
  };
  const [apiData, setApiData] = useState({
    state: "success",
    message: "",
    data: null,
  });

  const dataParse = (data) => {
    return data;
  };
  const loadData = async () => {
    setLoading(true);
    try {
      const snapshot = await firebase.getTeachersClasses();
      const classes = [];
      snapshot.forEach((doc) => classes.push({ id: doc.id, ...doc.data() }));
      setApiData({
        state: "success",
        message: "",
        data: dataParse(classes),
      });
      setLoading(false);
    } catch (error) {
      setApiData({
        state: "error",
        message: error.message,
        data: null,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const renderCard = (card, index) => {
    const gradientColors = index % 2 ? GRADIENT_BLUE : GRADIENT_PINK;

    return (
      <TouchableOpacity
        onPress={() => {
          onClickViewDetail(card.id);
          console.log("card click with id:", card.id);
        }}
      >
        <Card
          key={`card-${card.id}`}
          flex
          borderless
          shadowColor={theme.COLORS.BLACK}
          titleColor={card.full ? theme.COLORS.WHITE : null}
          style={styles.card}
          title={card.name}
          caption={
            /* card.caption */ `${language === "bah" ? "Gred" : "Grade"} ${
              card.grade
            }`
          }
          location={
            /* card.location */ `${
              language === "bah" ? "Bahagian" : "Section"
            } ${card.section}`
          }
          avatar={`${card.image}?${card.id}`}
          image={card.image}
          imageStyle={[card.padded ? styles.rounded : null]}
          imageBlockStyle={[
            card.padded ? { padding: theme.SIZES.BASE / 2 } : null,
            card.full ? null : styles.noRadius,
          ]}
          footerStyle={card.full ? styles.full : null}
        >
          {card.full ? (
            <LinearGradient
              colors={["transparent", "rgba(0,0,0, 0.8)"]}
              style={styles.gradient}
            />
          ) : null}
        </Card>
      </TouchableOpacity>
    );
  };

  const renderCards = (classes) =>
    classes.map((card, index) => renderCard(card, index));

  return (
    <>
      <Header
        title={language === "bah" ? "Papan Pemuka Guru" : "Teacher Dashboard"}
        search
        onSearchTextChange={onSearchKeyChange}
        searchHint={
          language === "bah" ? "Cari kelas anda" : "Search your classes"
        }
        navigation={navigation}
      />
      <Block safe flex>
        {apiData.data ? (
          apiData.data.length === 0 ? (
            <Block shadow center flex style={{ marginTop: 20 }}>
              <Text h6>
                {language === "bah"
                  ? "Anda belum ditugaskan ke mana-mana kelas lagi!"
                  : "You are not assigned to any class yet!"}
              </Text>
            </Block>
          ) : (
            <ScrollView style={{ flex: 1 }}>
              <Block flex space="between">
                {renderCards(apiData.data)}
              </Block>
            </ScrollView>
          )
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
                  ? "Memuatkan kelas anda"
                  : "Loading your classes"
              }
            />
          </Block>
        )}
      </Block>
    </>
  );
};

const styles = StyleSheet.create({
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

export default TeacherHome;
