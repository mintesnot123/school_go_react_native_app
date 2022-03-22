import React, { useState, useContext } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Image,
} from "react-native";
import firebase from "../firebase/firebase";
import { AuthContext } from "../firebase/context";
// galio component
import { Block, Button, Input, Text, NavBar, Switch } from "galio-framework";
import { RadioButton } from "react-native-paper";
import theme from "./theme";
import { argonTheme } from "../constants";
import ProgressDialog from "react-native-progress-dialog";

const { width } = Dimensions.get("window");

const MARGIN_LEFT = "5%";
const SOCIAL_ICON_SIZE = theme.SIZES.BASE * 1.5;
const SOCIAL_BTN_SIZE = theme.SIZES.BASE * 3;

const Register = ({ navigation, route }) => {
  //const { user } = useContext(AuthContext);
  const { user, loaded, language, changeLanguage } = useContext(AuthContext);
  console.log("user", user);
  const [state, setState] = useState({
    name: "",
    role: "parent",
    email: "",
    password: "",
  });
  const [result, setResult] = useState({
    state: "success",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const clearStates = () => {
    setState({
      name: "",
      role: "parent",
      email: "",
      password: "",
    });
  };
  const resetResult = () => {
    setResult({
      state: "success",
      message: "",
    });
  };
  const validateStates = () => {
    let message = "";
    if (!state.name) {
      message = "Name is required!";
    } else if (!state.email) {
      message = "Email is required!";
    } else if (!state.password) {
      message = "Password is required!";
    }
    return message;
  };

  const handleChange = (name, value) => {
    setState({ ...state, [name]: value });
  };
  const handleSignUp = () => {
    resetResult();
    const validateVar = validateStates();
    if (validateVar === "") {
      setLoading(true);
      firebase
        .createAccount(state.email, state.password, state.name)
        .then((result) => {
          //console.log("result: ", result);
          firebase
            .addUserData(
              result.user.uid,
              {
                email: state.email,
                name: state.name,
              },
              state.role
            )
            .then((result2) => {
              //console.log("result2: ", result2);
              setResult({
                state: "success",
                message: "Account created successfully",
              });
              clearStates();
              setLoading(false);
            })
            .catch((error) => {
              console.log("error: ", error);
              setResult({
                state: "error",
                message: error.message
                  ? error.message
                  : "Something went wrong while creating account!",
              });
              setLoading(false);
            });
        })
        .catch((error) => {
          console.log("error: ", error);
          setResult({
            state: "error",
            message: error.message
              ? error.message
              : "Something went wrong while creating account!",
          });
          setLoading(false);
        });
    } else {
      setResult({
        state: "error",
        message: validateVar,
      });
    }
  };

  const handleGoBack = () => navigation.openDrawer();
  const handleOnPressSocial = () => Alert.alert("Oops", "Not Implementated");
  const handleSignIn = () => navigation.navigate("login");

  /* const handleSignUp = () => {
    const { name, role, email, password } = state;

    Alert.alert(
      "Sign up action",
      `Name: ${name}
    Role: ${role}
    Email: ${email}
    Password: ${password}`
    );
  }; */

  return (
    <>
      <Block safe flex style={styles.container}>
        <NavBar
          transparent
          back
          leftStyle={{ marginLeft: MARGIN_LEFT }}
          leftIconColor={theme.COLORS.GREY}
          onLeftPress={() => {}}
          rightStyle={{ marginRight: 1, paddingRight: 1, marginTop: 30 }}
          right={
            <Block row={true}>
              <Text
                style={{ marginRight: 1, paddingRight: 1, marginTop: 10 }}
                muted
                size={theme.SIZES.FONT * 0.875}
              >
                Bah
              </Text>
              <Switch value={language === "bah"} onChange={changeLanguage} />
            </Block>
          }
        />
        <ScrollView style={styles.flex} keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={2}>
            <Block flex center style={{ marginBottom: 20 }}>
              <Image
                source={require("./icon.jpg")}
                style={{ width: 233, height: 200 }}
              />
              {/* <SocialButtons
                onPressFacebook={handleOnPressSocial}
                onPressTwitter={handleOnPressSocial}
                onPressInstagram={handleOnPressSocial}
              />
              <Text muted center size={theme.SIZES.FONT * 0.875}>
                {language === "bah"
                  ? "atau Daftar dengan e-mel"
                  : "or Sign Up with email"}
              </Text> */}
            </Block>
            <Header
              title={
                language === "bah" ? "Buat akaun baru" : "Create new account"
              }
            />
            <Block flex middle>
              <Form handleChange={handleChange} language={language} />
              <RadioSelects
                setValue={handleChange}
                value={state.role}
                language={language}
              />
              <Block row style={styles.passwordCheck}>
                {/* {result.message && result.message !== "" && ( */}
                <Text
                  center
                  bold
                  size={12}
                  color={
                    result.state === "success"
                      ? argonTheme.COLORS.SUCCESS
                      : argonTheme.COLORS.ERROR
                  }
                >
                  {result.message}
                </Text>
                {/* )} */}
              </Block>
              <SignButtons
                handleSignIn={handleSignIn}
                handleSignUp={handleSignUp}
                language={language}
              />
            </Block>
          </KeyboardAvoidingView>
        </ScrollView>
      </Block>
      <ProgressDialog
        visible={loading}
        label={language === "bah" ? "Mendaftar" : "Signing Up"}
      />
    </>
  );
};

const Header = ({ title }) => (
  <Block left center style={styles.header}>
    <Text center h3>
      {title}
    </Text>
  </Block>
);

const RadioSelects = ({ setValue, value, language }) => (
  /* <Block row center space="between" style={{ marginTop: 10, marginBottom: 30 }}> */
  <RadioButton.Group
    onValueChange={(newValue) => setValue("role", newValue)}
    value={value}
  >
    {/* <Block flex row> */}
      <View>
        <Text>{language === "bah" ? "ibu bapa" : "Parent"}</Text>
        <RadioButton value="parent" />
      </View>
      {/* </Block>
      <Block flex middle center> */}
      <View>
        <Text>{language === "bah" ? "cikgu" : "Teacher"}</Text>
        <RadioButton value="teacher" />
      </View>
    {/* </Block> */}
  </RadioButton.Group>
  /* </Block> */
);

const SocialButtons = ({
  onPressFacebook,
  onPressTwitter,
  onPressInstagram,
}) => (
  <Block row center space="between" style={styles.socialContainer}>
    <Block flex middle right>
      <Button
        round
        onlyIcon
        iconSize={SOCIAL_ICON_SIZE}
        icon="facebook"
        iconFamily="FontAwesome"
        onPress={onPressFacebook}
        color={theme.COLORS.FACEBOOK}
        shadowColor={theme.COLORS.FACEBOOK}
        iconColor={theme.COLORS.WHITE}
        style={styles.social}
      />
    </Block>
    <Block flex middle center>
      <Button
        round
        onlyIcon
        iconSize={SOCIAL_ICON_SIZE}
        icon="sc-twitter"
        iconFamily="EvilIcons"
        onPress={onPressTwitter}
        color={theme.COLORS.TWITTER}
        shadowColor={theme.COLORS.TWITTER}
        iconColor={theme.COLORS.WHITE}
        style={styles.social}
      />
    </Block>
    <Block flex middle left>
      <Button
        round
        onlyIcon
        iconSize={SOCIAL_ICON_SIZE}
        icon="sc-instagram"
        iconFamily="EvilIcons"
        onPress={onPressInstagram}
        color={theme.COLORS.DRIBBBLE}
        shadowColor={theme.COLORS.DRIBBBLE}
        iconColor={theme.COLORS.WHITE}
        style={styles.social}
      />
    </Block>
  </Block>
);

const Form = ({ handleChange, language }) => (
  <Block style={{ marginTop: 20, marginBottom: 10 }}>
    <Input
      style={styles.input}
      placeholder={language === "bah" ? "Nama penuh" : "Full Name"}
      color={theme.COLORS.INFO}
      placeholderTextColor={theme.COLORS.INFO}
      onChangeText={(text) => handleChange("name", text)}
    />
    <Input
      style={styles.input}
      type="email-address"
      placeholder={language === "bah" ? "E-mel" : "Email"}
      autoCapitalize="none"
      color={theme.COLORS.INFO}
      placeholderTextColor={theme.COLORS.INFO}
      onChangeText={(text) => handleChange("email", text)}
    />
    <Input
      style={styles.input}
      password
      viewPass
      placeholder={language === "bah" ? "Kata laluan" : "Password"}
      color={theme.COLORS.INFO}
      placeholderTextColor={theme.COLORS.INFO}
      onChangeText={(text) => handleChange("password", text)}
    />
  </Block>
);

const SignButtons = ({ handleSignUp, handleSignIn, language }) => (
  <Block flex center style={{ marginBottom: 20 }}>
    <Button
      shadowless
      style={styles.button}
      round
      color="info"
      onPress={handleSignUp}
    >
      {language === "bah" ? "daftar" : "Sign up"}
    </Button>
    <Button
      round
      color="transparent"
      style={[styles.button, styles.borderColor]}
      onPress={handleSignIn}
    >
      <Text center color={theme.COLORS.BLACK}>
        {language === "bah" ? "Log Masuk" : "Sign In"}
      </Text>
    </Button>
  </Block>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.WHITE,
    paddingTop: 15,
  },
  flex: {
    flex: 1,
  },
  social: {
    width: SOCIAL_BTN_SIZE,
    height: SOCIAL_BTN_SIZE,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: "center",
  },
  socialContainer: {
    marginVertical: theme.SIZES.BASE * 1.875,
  },
  input: {
    alignSelf: "center",
    width: width * 0.89,
    borderWidth: theme.SIZES.BASE * 0.07,
    borderRadius: 20,
    borderColor: theme.COLORS.INFO,
    marginTop: 5,
  },
  button: {
    marginVertical: 10,
    width: width * 0.89,
  },
  borderColor: {
    borderColor: theme.COLORS.GREY,
  },
  header: {
    width: "50%",
    marginLeft: MARGIN_LEFT,
  },
});

export default Register;
