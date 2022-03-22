import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { Text, Block, Button, NavBar, Input } from "galio-framework";
import theme from "./theme";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";
import firebase from "../firebase/firebase";

import SearchableDropdown from "react-native-searchable-dropdown";
import { useIsFocused } from "@react-navigation/native";
import ProgressDialog from "react-native-progress-dialog";

const { width } = Dimensions.get("screen");

const AddClass = ({ profile, setCurrentPage, loadData, language }) => {
  const isFocused = useIsFocused();
  const [state, setState] = useState({
    name: profile.name ? profile.name : "",
    image: "",
    phone:
      profile.profile && profile.profile.phone ? profile.profile.phone : "",
    address:
      profile.profile && profile.profile.address ? profile.profile.address : "",
    telegram:
      profile.profile && profile.profile.telegram
        ? profile.profile.telegram
        : "",
  });
  const [result, setResult] = useState({
    state: "success",
    message: "",
  });
  const [uploading, setUploading] = useState(false);
  const [pickerResultVar, setPickerResultVar] = useState(null);

  const [loading, setLoading] = useState(false);

  const clearStates = () => {
    setState({
      name: "",
      image: "",
      phone: "",
      address: "",
      telegram: "",
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
      message = "Parent name is required!";
    } else if (!state.phone) {
      message = "Parent phone is required!";
    }
    return message;
  };

  const handleChange = (name, value) => {
    setState({ ...state, [name]: value });
  };
  const handleAddStudent = async () => {
    resetResult();
    const validateVar = validateStates();
    if (validateVar === "") {
      const id = firebase.generateStudentKey();
      setLoading(true);
      try {
        setUploading(true);
        if (pickerResultVar) {
          if (!pickerResultVar.cancelled) {
            const uploadUrl = await uploadImageAsync(pickerResultVar.uri, id);
            //handleChange("image", uploadUrl);
            uploadData(uploadUrl);
          }
        } else {
          uploadData(id);
        }
      } catch (e) {
        console.log(e);
        alert("Upload failed, sorry :(");
      } finally {
        setUploading(false);
        setLoading(false);
      }
    } else {
      setResult({
        state: "error",
        message: validateVar,
      });
    }
  };

  const uploadData = (uploadUrl) => {
    const newState = {
      name: state.name,
      image: uploadUrl ? uploadUrl : "",
      profile: {
        phone: state.phone,
        address: state.address,
        telegram: state.telegram,
      },
    };
    firebase
      .updateParentProfile(newState)
      .then((result) => {
        console.log("result: ", result);
        setResult({
          state: "success",
          message: "Profile updated successfully",
        });
        clearStates();
        loadData();
        setCurrentPage("students");
        //navigation.navigate("class_detail", { class_id: class_id });
      })
      .catch((error) => {
        console.log("error: ", error);
        setResult({
          state: "error",
          message: error.message
            ? error.message
            : "Something went wrong while updating profile!",
        });
      });
  };

  const takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    setPickerResultVar(pickerResult);
    //handleImagePicked(pickerResult);
  };
  const pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    setPickerResultVar(pickerResult);
  };

  const handleImagePicked = async (pickerResult) => {
    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        console.log("uploadUrl", uploadUrl);
        handleChange("image", uploadUrl);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      setState({
        name: profile.name ? profile.name : "",
        image: "",
        phone:
          profile.profile && profile.profile.phone ? profile.profile.phone : "",
        address:
          profile.profile && profile.profile.address
            ? profile.profile.address
            : "",
        telegram:
          profile.profile && profile.profile.telegram
            ? profile.profile.telegram
            : "",
      });
    }
  }, [profile]);

  return (
    <Block safe flex>
      <ScrollView
        style={{ flex: 1, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <Block style={styles.container}>
          <Form handleChange={handleChange} state={state} language={language} />
          <Text p center>
            {language === "bah"
              ? "Muat naik imej profil"
              : "Upload profile image"}
          </Text>
          {pickerResultVar && (
            <Block center style={{ marginBottom: 10, marginTop: 10 }}>
              <Image
                source={{ uri: pickerResultVar.uri }}
                style={{ width: 267, height: 200 }}
              />
            </Block>
          )}
          <Block row center space="between" style={styles.socialContainer}>
            <Button
              onPress={pickImage}
              style={styles.button}
              color="success"
              round
            >
              {language === "bah" ? "Pilih imej" : "Pick an image"}
            </Button>
            <Button
              onPress={takePhoto}
              style={styles.button}
              color="success"
              round
            >
              {language === "bah" ? "Ambil gambar" : "Take a photo"}
            </Button>
          </Block>

          <SubmitButtons handleSubmit={handleAddStudent} language={language} />
        </Block>
      </ScrollView>
      <ProgressDialog
        visible={loading}
        label={language === "bah" ? "Menyerahkan" : "Submiting"}
      />
    </Block>
  );
};

const Form = ({ handleChange, state, language }) => (
  <>
    <Block flex>
      <Block flex style={{ padding: theme.SIZES.BASE }}>
        <Text center h5>
          {language === "bah" ? "Sunting profil" : "Edit Profile"}
        </Text>
      </Block>

      <Block style={{ padding: theme.SIZES.BASE }}>
        <Input
          rounded
          placeholder={language === "bah" ? "Nama" : "Name"}
          color={theme.COLORS.THEME}
          placeholderTextColor={theme.COLORS.THEME}
          style={{ borderColor: theme.COLORS.THEME }}
          autoCapitalize="sentences"
          value={state.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        <Input
          rounded
          placeholder={language === "bah" ? "Nombor telefon" : "Phone Number"}
          color={theme.COLORS.THEME}
          placeholderTextColor={theme.COLORS.THEME}
          style={{ borderColor: theme.COLORS.THEME }}
          type="number-pad"
          value={state.phone}
          onChangeText={(text) => handleChange("phone", text)}
        />
        <Input
          rounded
          placeholder={language === "bah" ? "Alamat" : "Address"}
          color={theme.COLORS.THEME}
          placeholderTextColor={theme.COLORS.THEME}
          style={{ borderColor: theme.COLORS.THEME }}
          autoCapitalize="sentences"
          value={state.address}
          onChangeText={(text) => handleChange("address", text)}
        />
        <Input
          rounded
          placeholder={
            language === "bah" ? "Nama Pengguna Telegram" : "Telegram Username"
          }
          color={theme.COLORS.THEME}
          placeholderTextColor={theme.COLORS.THEME}
          style={{ borderColor: theme.COLORS.THEME }}
          autoCapitalize="sentences"
          value={state.telegram}
          onChangeText={(text) => handleChange("telegram", text)}
        />
      </Block>
    </Block>
  </>
);

const SubmitButtons = ({ handleSubmit, language }) => (
  <Block flex style={{ marginBottom: theme.SIZES.BASE }}>
    <Block flex center style={{ padding: theme.SIZES.BASE }}>
      <Button style={styles.button} round onPress={handleSubmit}>
        {language === "bah" ? "Hantar" : "Submit"}
      </Button>
    </Block>
  </Block>
);

async function uploadImageAsync(uri, id) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileRef = firebase.storage.ref().child(`parents/${id}`);
  //const fileRef = ref(getStorage(), uuid.v4());
  //const result = await uploadBytes(fileRef, blob);

  const snapshot = await fileRef.put(blob, { contentType: "image/png" });

  // We're done with the blob, close and release it
  blob.close();

  // Create a download URL
  const remoteURL = await snapshot.ref.getDownloadURL();

  // Return the URL
  return remoteURL;

  //return await getDownloadURL(fileRef);
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    justifyContent: "flex-start",
    //backgroundColor: theme.COLORS.WHITE,
  },
  button: {
    marginBottom: 20,
  },
});

export default AddClass;
