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
import {
  LoadingModal,
  LoadingModalManager,
} from "react-native-loading-spinner-modal";

const { width } = Dimensions.get("screen");

const AddClass = ({ navigation }) => {
  const [state, setState] = useState({
    name: "",
    image: "",
    grade: "",
    section: "",
    description: "",
  });
  const [result, setResult] = useState({
    state: "success",
    message: "",
  });
  const [uploading, setUploading] = useState(false);
  const [pickerResultVar, setPickerResultVar] = useState(null);
  const loadingmodal = useRef();

  const clearStates = () => {
    setState({
      name: "",
      image: "",
      grade: "",
      section: "",
      description: "",
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
      message = "Class name is required!";
    } else if (!state.grade) {
      message = "Class grade is required!";
    } else if (!state.section) {
      message = "Class section is required!";
    }
    return message;
  };

  const handleChange = (name, value) => {
    setState({ ...state, [name]: value });
  };
  const handleAddClass = async () => {
    resetResult();
    const validateVar = validateStates();
    if (validateVar === "") {
      const id = firebase.generateClassKey();
      try {
        setUploading(true);
        if (pickerResultVar) {
          if (!pickerResultVar.cancelled) {
            const uploadUrl = await uploadImageAsync(pickerResultVar.uri, id);
            //handleChange("image", uploadUrl);
            uploadData(id, uploadUrl);
          }
        } else {
          uploadData(id);
        }
      } catch (e) {
        console.log(e);
        alert("Upload failed, sorry :(");
      } finally {
        setUploading(false);
      }
    } else {
      setResult({
        state: "error",
        message: validateVar,
      });
    }
  };

  const uploadData = (id, uploadUrl) => {
    const newState = {
      ...state,
      image: uploadUrl ? uploadUrl : "",
    };
    firebase
      .addClass(id, newState)
      .then((result) => {
        //console.log("result: ", result);
        setResult({
          state: "success",
          message: "Class added successfully",
        });
        clearStates();
        navigation.navigate("admin_home");
      })
      .catch((error) => {
        console.log("error: ", error);
        setResult({
          state: "error",
          message: error.message
            ? error.message
            : "Something went wrong while adding class!",
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
    //console.log({ pickerResult });

    //handleImagePicked(pickerResult);
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
  /* useEffect(() => {
    LoadingModalManager.registerModal(loadingmodal);
    showLoading();
    return LoadingModalManager.unregisterModal();
  }, []);
  const showLoading = () => {
    LoadingModalManager.showLoadingModal({
      text: "your text goes here", //default as `loading...`
      subText: "Your alert message goes here", //default ""
    });
  };
  const hideLoading = () => {
    LoadingModalManager.hideLoadingModal();
  }; */
  return (
    <Block safe flex>
      {/* <LoadingModal ref={loadingmodal.current} /> */}
      <NavBar
        title="Add Class"
        style={
          Platform.OS === "android" ? { marginTop: theme.SIZES.BASE } : null
        }
      />
      <ScrollView
        style={{ flex: 1, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Block style={styles.container}>
          <Form handleChange={handleChange} />
          <Text p center>
            Upload class image
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
              Pick an image
            </Button>
            <Button
              onPress={takePhoto}
              style={styles.button}
              color="success"
              round
            >
              Take a photo
            </Button>
          </Block>

          <SubmitButtons handleSubmit={handleAddClass} />
        </Block>
      </ScrollView>
    </Block>
  );
};

const Form = ({ handleChange }) => (
  <>
    <Block flex>
      <Block flex style={{ padding: theme.SIZES.BASE }}>
        <Text h5>Add Class Form</Text>
      </Block>
      <Block style={{ padding: theme.SIZES.BASE }}>
        <Input
          rounded
          placeholder="Class Name"
          color={theme.COLORS.THEME}
          placeholderTextColor={theme.COLORS.THEME}
          style={{ borderColor: theme.COLORS.THEME }}
          autoCapitalize="sentences"
          onChangeText={(text) => handleChange("name", text)}
        />
        <Input
          rounded
          placeholder="Class Grade"
          color={theme.COLORS.THEME}
          placeholderTextColor={theme.COLORS.THEME}
          style={{ borderColor: theme.COLORS.THEME }}
          type="number-pad"
          onChangeText={(text) => handleChange("grade", text)}
        />
        <Input
          rounded
          placeholder="Class Section"
          color={theme.COLORS.THEME}
          placeholderTextColor={theme.COLORS.THEME}
          style={{ borderColor: theme.COLORS.THEME }}
          autoCapitalize="sentences"
          onChangeText={(text) => handleChange("section", text)}
        />
        <Input
          rounded
          placeholder="Class Description"
          color={theme.COLORS.THEME}
          placeholderTextColor={theme.COLORS.THEME}
          style={{ borderColor: theme.COLORS.THEME }}
          autoCapitalize="sentences"
          onChangeText={(text) => handleChange("description", text)}
        />
      </Block>
    </Block>
  </>
);

const SubmitButtons = ({ handleSubmit }) => (
  <Block flex style={{ marginBottom: theme.SIZES.BASE }}>
    <Block flex center style={{ padding: theme.SIZES.BASE }}>
      <Button style={styles.button} round onPress={handleSubmit}>
        Submit
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

  const fileRef = firebase.storage.ref().child(`classes/${id}`);
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
    backgroundColor: theme.COLORS.WHITE,
  },
  button: {
    marginBottom: 20,
  },
});

export default AddClass;
