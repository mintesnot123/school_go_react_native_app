import { Linking, Alert, Platform } from "react-native";

export const callNumber = (phone) => {
  console.log("callNumber ----> ", phone);
  let phoneNumber = phone;
  if (Platform.OS !== "android") {
    phoneNumber = `telprompt:${phone}`;
  } else {
    phoneNumber = `tel:${phone}`;
  }
  Linking.canOpenURL(phoneNumber)
    .then((supported) => {
      if (!supported) {
        Alert.alert("Phone number is not available");
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch((err) => console.log(err));
};
export const textNumber = (phone) => {
  let phoneNumber = phone;
  if (Platform.OS !== "android") {
    phoneNumber = `smsprompt:${phone}`;
  } else {
    phoneNumber = `sms:${phone}`;
  }
  Linking.canOpenURL(phoneNumber)
    .then((supported) => {
      if (!supported) {
        Alert.alert("Phone number is not available");
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch((err) => console.log(err));
};
export const messageTelegram = (telegramUsername) => {
  let phoneNumber = `https://telegram.me/${telegramUsername}`;

  Linking.canOpenURL(phoneNumber)
    .then((supported) => {
      if (!supported) {
        Alert.alert("Phone number is not available");
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch((err) => console.log(err));
};
export const messageWhatsapp = (phone) => {
  console.log("callNumber ----> ", phone);
  let phoneNumber = `whatsapp://send?phone=${phone}&text=${"Hello"}`;
  /* if (Platform.OS !== "android") {
    phoneNumber = `telprompt:${phone}`;
  } else {
    phoneNumber = `tel:${phone}`;
  } */
  //Linking.openURL(`whatsapp://send?phone=${whatsappNo}&text=${"Hello"}`);
  Linking.canOpenURL(phoneNumber)
    .then((supported) => {
      if (!supported) {
        Alert.alert("Phone number is not available");
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch((err) => console.log(err));
};
export const sendEmail = (email) => {
  Linking.openURL(`mailto:${email}`);
};
