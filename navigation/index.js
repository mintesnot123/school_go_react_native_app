import React, { useState, useContext } from "react";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Icon, Header } from "../components";
//import Register from "../screens/Register";
import Register2 from "../screens/Register2";
import Register3 from "../screens/Register3";
import Home from "../screens/Home";
import AdminHome from "../screens/AdminHome";
import AddClass from "../screens/AddClass";
import Dashboard from "../screens/Dashboard";
import Profile from "../screens/Profile";
import News from "../screens/News";
import Article from "../screens/Article";
import ArticleFeedv1 from "../screens/ArticleFeedv1";
import Articles from "../screens/Articles";
import Cards from "../screens/Cards";
import TeacherHome from "../screens/TeacherHome";
import ClassDetail from "../screens/ClassDetail";
import AdminClassDetail from "../screens/AdminClassDetail";
import AddStudent from "../screens/AddStudent";
import Components from "../screens/Components";
import LoadingScreen from "../screens/LoadingScreen";

import Register from "../screens/Register";
import Login from "../screens/Login";

import ParentHome from "../screens/ParentHome";

import Screens from "../navigation/Screens";
import { AuthContext } from "../firebase/context";

const Stack = createNativeStackNavigator();

function AdminHomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="admin_home"
        component={AdminHome}
        options={{
          header: () => null,
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen name="add_class" component={AddClass} />
      <Stack.Screen
        name="class_detail"
        component={AdminClassDetail}
        options={{
          header: () => null,
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen name="add_student" component={AddStudent} />
      <Stack.Screen name="student_detail" component={Profile} />
    </Stack.Navigator>
  );
}

function TeacherHomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="teacher_home"
        component={TeacherHome}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="class_detail"
        component={ClassDetail}
        options={{
          header: () => null,
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen name="add_student" component={AddStudent} />
      <Stack.Screen name="student_detail" component={Profile} />
    </Stack.Navigator>
  );
}

function ParentHomeStack(props) {
  return (
    <Stack.Navigator initialRouteName="Parent" mode="card" headerMode="screen">
      <Stack.Screen
        name="Parent"
        component={ParentHome}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen name="student_detail_parent" component={Profile} />
    </Stack.Navigator>
  );
}

export default (props) => {
  const { user, loaded, language, changeLanguage } = useContext(AuthContext);

  return (
    <NavigationContainer
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Navigator>
        {!loaded ? (
          <>
            <Stack.Screen
              name="home"
              component={LoadingScreen}
              options={{ header: () => null }}
            />
          </>
        ) : user ? (
          user.role === "admin" ? (
            <>
              <Stack.Screen
                name="home"
                component={AdminHomeStack}
                options={{ header: () => null }}
              />
            </>
          ) : user.role === "teacher" ? (
            <>
              <Stack.Screen
                name="teacher"
                component={TeacherHomeStack}
                options={{ header: () => null }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="parent"
                component={ParentHomeStack}
                options={{ header: () => null }}
              />
            </>
          )
        ) : (
          <>
            <Stack.Screen
              name="login"
              component={Login}
              options={{ header: () => null }}
            />
            <Stack.Screen
              name="register"
              component={Register}
              options={{ header: () => null }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
