import React, { useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import firebase from "../firebase/firebase";

const { width, height } = Dimensions.get("screen");

const Register = () => {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [result, setResult] = useState({
    state: "success",
    message: "",
  });

  const clearFields = () => {
    setFields({
      name: "",
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
  const validateFields = () => {
    let message = "";
    if (!fields.name) {
      message = "Name is required!";
    } else if (!fields.email) {
      message = "Email is required!";
    } else if (!fields.password) {
      message = "Password is required!";
    }
    return message;
  };

  const onFieldChange = (name, text) => {
    setFields({ ...fields, [name]: text });
  };
  const onRegisterUser = () => {
    resetResult();
    const validateVar = validateFields();
    if (validateVar === "") {
      firebase
        .createAccount(fields.email, fields.password, fields.name)
        .then((result) => {
          //console.log("result: ", result);
          setResult({
            state: "success",
            message: "Account created successfully",
          });
          clearFields();
          firebase
            .addParent(result.user.uid, {
              email: fields.email,
              name: fields.name,
            })
            .then((result2) => {
              //console.log("result2: ", result2);
            })
            .catch((error) => {
              console.log("error: ", error);
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
        });
    } else {
      setResult({
        state: "error",
        message: validateVar,
      });
    }
  };

  return (
    <Block flex middle>
      <StatusBar hidden />
      <ImageBackground
        source={Images.RegisterBackground}
        style={{ width, height, zIndex: 1 }}
      >
        <Block safe flex middle>
          <Block style={styles.registerContainer}>
            <Block flex={0.25} middle style={styles.socialConnect}>
              <Text color="#8898AA" size={12}>
                Sign up with
              </Text>
              <Block row style={{ marginTop: theme.SIZES.BASE }}>
                <Button style={{ ...styles.socialButtons, marginRight: 30 }}>
                  <Block row>
                    <Icon
                      name="logo-github"
                      family="Ionicon"
                      size={14}
                      color={"black"}
                      style={{ marginTop: 2, marginRight: 5 }}
                    />
                    <Text style={styles.socialTextButtons}>GITHUB</Text>
                  </Block>
                </Button>
                <Button style={styles.socialButtons}>
                  <Block row>
                    <Icon
                      name="logo-google"
                      family="Ionicon"
                      size={14}
                      color={"black"}
                      style={{ marginTop: 2, marginRight: 5 }}
                    />
                    <Text style={styles.socialTextButtons}>GOOGLE</Text>
                  </Block>
                </Button>
              </Block>
            </Block>
            <Block flex>
              <Block flex={0.17} middle>
                <Text color="#8898AA" size={12}>
                  Or sign up the classic way
                </Text>
              </Block>
              <Block flex center>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled
                >
                  <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                    <Input
                      borderless
                      placeholder="Name"
                      onChangeText={(text) => onFieldChange("name", text)}
                      value={fields.name}
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="hat-3"
                          family="ArgonExtra"
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                    <Input
                      borderless
                      placeholder="Email"
                      onChangeText={(text) => onFieldChange("email", text)}
                      value={fields.email}
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="ic_mail_24px"
                          family="ArgonExtra"
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      password
                      borderless
                      placeholder="Password"
                      onChangeText={(text) => onFieldChange("password", text)}
                      value={fields.password}
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="padlock-unlocked"
                          family="ArgonExtra"
                          style={styles.inputIcons}
                        />
                      }
                    />
                    <Block row style={styles.passwordCheck}>
                      {/*  <Text size={12} color={argonTheme.COLORS.MUTED}>
                        password strength:
                      </Text> */}
                      {/* {result.message && result.message !== "" && ( */}
                      <Text
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
                  </Block>
                  <Block row width={width * 0.75}>
                    <Checkbox
                      checkboxStyle={{
                        borderWidth: 3,
                      }}
                      color={argonTheme.COLORS.PRIMARY}
                      label="I agree with the"
                    />
                    <Button
                      style={{ width: 100 }}
                      color="transparent"
                      textStyle={{
                        color: argonTheme.COLORS.PRIMARY,
                        fontSize: 14,
                      }}
                    >
                      Privacy Policy
                    </Button>
                  </Block>
                  <Block middle>
                    <Button
                      //onClick={onRegisterUser}
                      onPress={onRegisterUser}
                      color="primary"
                      style={styles.createButton}
                    >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        CREATE ACCOUNT
                      </Text>
                    </Button>
                  </Block>
                </KeyboardAvoidingView>
              </Block>
            </Block>
          </Block>
        </Block>
      </ImageBackground>
    </Block>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.875,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA",
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14,
  },
  inputIcons: {
    marginRight: 12,
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
  },
});

export default Register;
