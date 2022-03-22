import React, { useState, useEffect, useRef, useContext } from "react";
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
import { AuthContext } from "../firebase/context";
import {
  LoadingModal,
  LoadingModalManager,
} from "react-native-loading-spinner-modal";
import SearchableDropdown from "react-native-searchable-dropdown";
import { useIsFocused } from "@react-navigation/native";
import ProgressDialog from "react-native-progress-dialog";

const { width } = Dimensions.get("screen");

const AddClass = ({ navigation, route }) => {
  const { user, loaded, language, changeLanguage } = useContext(AuthContext);
  const class_id = route.params.class_id;
  const isFocused = useIsFocused();
  const [state, setState] = useState({
    name: "",
    image: "",
    grade: "",
    section: "",
    description: "",
    parents: [],
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [result, setResult] = useState({
    state: "success",
    message: "",
  });
  const [uploading, setUploading] = useState(false);
  const [pickerResultVar, setPickerResultVar] = useState(null);
  const loadingmodal = useRef();

  const [loading, setLoading] = useState(false);

  const [apiData, setApiData] = useState({
    state: "success",
    message: "",
    data: null,
  });
  const dataParse = (data) => {
    return Object.keys(data).map((key) => {
      return {
        id: key,
        name: data[key].email,
        studentName: data[key].name,
      };
    });
  };
  const loadData = () => {
    firebase
      .getDocList("parents")
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
  const [apiData2, setApiData2] = useState({
    state: "success",
    message: "",
    data: null,
  });
  const dataParse2 = (data) => {
    console.log(data);
    return Object.keys(data).map((key) => {
      return {
        id: key,
        name: data[key].name,
      };
    });
  };
  const loadData2 = () => {
    firebase
      .getDocList("students")
      .then((response) => {
        setApiData2({
          state: "success",
          message: "",
          data: dataParse2(response.data()),
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
  useEffect(() => {
    if (isFocused) {
      loadData();
      loadData2();
    }
  }, [isFocused]);

  const clearStates = () => {
    setState({
      name: "",
      image: "",
      grade: "",
      section: "",
      description: "",
      parents: [],
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
      message =
        language === "bah"
          ? "Nama pelajar diperlukan!"
          : "Student name is required!";
    } else if (!state.grade) {
      message =
        language === "bah"
          ? "Gred pelajar diperlukan!"
          : "Student grade is required!";
    } else if (!state.section) {
      message =
        language === "bah"
          ? "Bahagian pelajar diperlukan!"
          : "Student section is required!";
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
        setLoading(false);
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
      parents: state.parents.map((parent) => parent.id),
      image: uploadUrl ? uploadUrl : "",
    };
    firebase
      .addNewStudentByTeacher(id, class_id, newState)
      .then((result) => {
        //console.log("result: ", result);
        setResult({
          state: "success",
          message: "Student added successfully",
        });
        clearStates();
        navigation.navigate("class_detail", { class_id: class_id });
      })
      .catch((error) => {
        console.log("error: ", error);
        setResult({
          state: "error",
          message: error.message
            ? error.message
            : "Something went wrong while adding student!",
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

  return (
    <Block safe flex>
      {/* <LoadingModal ref={loadingmodal.current} /> */}
      <NavBar
        title={language === "bah" ? "Tambah Pelajar" : "Add Student"}
        style={
          Platform.OS === "android" ? { marginTop: theme.SIZES.BASE } : null
        }
      />
      <ScrollView
        style={{ flex: 1, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <Block style={styles.container}>
          {apiData.data && apiData2.data ? (
            <>
              <Block flex>
                <OldStudentForm
                  setSelectedStudents={setSelectedStudents}
                  selectedStudents={selectedStudents}
                  items={apiData2.data}
                  language={language}
                />
                <Text muted center size={theme.SIZES.FONT * 0.875}>
                  {language === "bah"
                    ? "Atau Buat Pelajar Baru"
                    : "Or Create New Student"}
                </Text>
              </Block>
              <Form
                handleChange={handleChange}
                state={state}
                items={apiData.data}
                language={language}
              />
              <Text p center>
                {language === "bah"
                  ? "Muat naik imej pelajar"
                  : "Upload student image"}
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

              <SubmitButtons
                handleSubmit={handleAddStudent}
                language={language}
              />
            </>
          ) : (apiData.message && apiData.message !== "") ||
            (apiData2.message && apiData2.message !== "") ? (
            <Text h3>Error: {apiData.message || apiData2.message}</Text>
          ) : (
            <ProgressDialog
              visible={true}
              label={language === "bah" ? "Memuatkan" : "Loading"}
            />
          )}
        </Block>
      </ScrollView>
      <ProgressDialog
        visible={loading}
        label={language === "bah" ? "Menyerahkan" : "Submiting"}
      />
    </Block>
  );
};

const OldStudentForm = ({
  setSelectedStudents,
  selectedStudents,
  items,
  language,
}) => (
  <Block style={{ padding: theme.SIZES.BASE }}>
    <SearchableDropdown
      multi={true}
      selectedItems={selectedStudents}
      onItemSelect={(item) => {
        console.log("item", item);
        const items = selectedStudents;
        items.push(item);
        setSelectedStudents(items);
        //this.setState({ selectedItems: items });
      }}
      containerStyle={{ padding: 5 }}
      onRemoveItem={(item, index) => {
        const items = selectedStudents.filter((sitem) => sitem.id !== item.id);
        setSelectedStudents(items);
        //this.setState({ selectedItems: items });
      }}
      itemStyle={{
        padding: 10,
        marginTop: 2,
        backgroundColor: theme.COLORS.WHITE /* "#ddd" */,
        borderColor: theme.COLORS.BLACK /* "#bbb" */,
        borderWidth: 1,
        borderRadius: 5,
      }}
      itemTextStyle={{ color: "#222" }}
      itemsContainerStyle={{ maxHeight: 150 }}
      items={items}
      //defaultIndex={20}
      chip={true}
      resetValue={false}
      textInputProps={{
        placeholder: language === "bah" ? "Pilih pelajar" : "Select students",
        underlineColorAndroid: "transparent",
        //rounded: true,
        color: theme.COLORS.THEME,
        placeholderTextColor: theme.COLORS.THEME,

        style: {
          padding: 10,
          borderWidth: 1,
          borderRadius: 15,
          borderColor: theme.COLORS.THEME,
        },
      }}
      listProps={{
        nestedScrollEnabled: true,
      }}
    />
  </Block>
);

const Form = ({ handleChange, state, items, language }) => (
  <>
    <Block flex>
      <Block flex style={{ padding: theme.SIZES.BASE }}>
        <Text center h5>
          {language === "bah" ? "Tambah Borang Pelajar" : "Add Student Form"}
        </Text>
      </Block>
      <Block style={{ padding: theme.SIZES.BASE }}>
        <Input
          rounded
          placeholder={language === "bah" ? "Nama pelajar" : "Student Name"}
          color={theme.COLORS.THEME}
          placeholderTextColor={theme.COLORS.THEME}
          style={{ borderColor: theme.COLORS.THEME }}
          autoCapitalize="sentences"
          onChangeText={(text) => handleChange("name", text)}
        />
        <Input
          rounded
          placeholder={language === "bah" ? "Gred Pelajar" : "Student Grade"}
          color={theme.COLORS.THEME}
          placeholderTextColor={theme.COLORS.THEME}
          style={{ borderColor: theme.COLORS.THEME }}
          type="number-pad"
          onChangeText={(text) => handleChange("grade", text)}
        />
        <Input
          rounded
          placeholder={
            language === "bah" ? "Bahagian Pelajar" : "Student Section"
          }
          color={theme.COLORS.THEME}
          placeholderTextColor={theme.COLORS.THEME}
          style={{ borderColor: theme.COLORS.THEME }}
          autoCapitalize="sentences"
          onChangeText={(text) => handleChange("section", text)}
        />
        <Input
          rounded
          placeholder={
            language === "bah" ? "Penerangan Pelajar" : "Student Description"
          }
          color={theme.COLORS.THEME}
          placeholderTextColor={theme.COLORS.THEME}
          style={{ borderColor: theme.COLORS.THEME }}
          autoCapitalize="sentences"
          onChangeText={(text) => handleChange("description", text)}
        />
        <SearchableDropdown
          multi={true}
          selectedItems={state.parents}
          onItemSelect={(item) => {
            console.log("item", item);
            const items = state.parents;
            items.push(item);
            handleChange("parents", items);
            //this.setState({ selectedItems: items });
          }}
          containerStyle={{ padding: 5 }}
          onRemoveItem={(item, index) => {
            const items = state.parents.filter((sitem) => sitem.id !== item.id);
            handleChange("parents", items);
            //this.setState({ selectedItems: items });
          }}
          itemStyle={{
            padding: 10,
            marginTop: 2,
            backgroundColor: theme.COLORS.WHITE /* "#ddd" */,
            borderColor: theme.COLORS.BLACK /* "#bbb" */,
            borderWidth: 1,
            borderRadius: 5,
          }}
          itemTextStyle={{ color: "#222" }}
          itemsContainerStyle={{ maxHeight: 150 }}
          items={items}
          //defaultIndex={20}
          chip={true}
          resetValue={false}
          textInputProps={{
            placeholder:
              language === "bah" ? "Ibu bapa pelajar" : "Student parents",
            underlineColorAndroid: "transparent",
            //rounded: true,
            color: theme.COLORS.THEME,
            placeholderTextColor: theme.COLORS.THEME,

            style: {
              padding: 10,
              borderWidth: 1,
              borderRadius: 15,
              borderColor: theme.COLORS.THEME,
            },
          }}
          listProps={{
            nestedScrollEnabled: true,
          }}
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

  const fileRef = firebase.storage.ref().child(`students/${id}`);
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
