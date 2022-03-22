import app from "@firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBO6ETzVAkmX3l2FAorcgA2qhDd1702o5k",
  authDomain: "schoolgo-19532.firebaseapp.com",
  projectId: "schoolgo-19532",
  storageBucket: "schoolgo-19532.appspot.com",
  messagingSenderId: "874259621131",
  appId: "1:874259621131:web:d8530db1b69d4e317a6e0e",
  //measurementId: "G-RLWL8CL7N5",
};

class Firebase {
  constructor() {
    if (app.apps.length === 0) {
      Firebase = app.initializeApp(firebaseConfig);
    }
    this.storage = app.storage();
    this.db = app.firestore();
    this.auth = app.auth();
    this.function = app.functions();
  }

  createAccount = (email, password, fullname) => {
    return this.auth.createUserWithEmailAndPassword(email, password);
  };
  signIn = (email, password) => {
    return this.auth.signInWithEmailAndPassword(email, password);
  };
  signOut = () => {
    return this.auth.signOut();
  };
  onAuthStateChanged = (setUser) => {
    return this.auth.onAuthStateChanged(setUser);
  };

  addUserData = (id, user, role) => {
    if (role === "parent") {
      return this.addParent(id, user);
    } else if (role === "teacher") {
      return this.addTeacher(id, user);
    } else {
      return null;
    }
  };
  getUser = (id) => {
    return this.db.collection("users").doc(id).get();
  };

  getDocList = (collectionName) => {
    return this.db.collection("lookups").doc(collectionName).get();
  };

  addParent = (id, user) => {
    var batch = this.db.batch();
    batch.set(this.db.collection("users").doc(id), {
      email: user.email,
      role: "parent",
    });
    batch.set(this.db.collection("parents").doc(id), user);
    batch.update(this.db.collection("lookups").doc("parents"), {
      [id]: this.parentMini(user),
    });
    return batch.commit();
  };
  getParent = (parent_id) => {
    return this.db.collection("parents").doc(parent_id).get();
  };
  getCurrentParent = () => {
    return this.db.collection("parents").doc(this.auth.currentUser.uid).get();
  };
  updateParentProfile = (updates) => {
    return this.db
      .collection("parents")
      .doc(this.auth.currentUser.uid)
      .update(updates);
  };

  parentMini = (user) => {
    return user;
  };

  addTeacher = (id, user) => {
    var batch = this.db.batch();
    batch.set(this.db.collection("users").doc(id), {
      email: user.email,
      role: "teacher",
    });
    batch.set(this.db.collection("teacher").doc(id), user);
    batch.update(this.db.collection("lookups").doc("teachers"), {
      [id]: this.parentMini(user),
    });
    return batch.commit();
  };

  teacherMini = (user) => {
    return user;
  };

  generateClassKey = () => {
    return this.db.collection("classes").doc().id;
  };

  addClass = (class_id, classData) => {
    const newClass = {
      teachers: [],
      id: class_id,
      name: classData.name,
      image: classData.image,
      grade: classData.grade,
      section: classData.section,
      description: classData.description,
    };
    var batch = this.db.batch();
    batch.set(this.db.collection("classes").doc(class_id), newClass);
    batch.update(this.db.collection("lookups").doc("classes"), {
      [class_id]: this.classMini(newClass),
    });
    batch.set(
      this.db
        .collection("classes")
        .doc(class_id)
        .collection("data")
        .doc("students1"),
      {
        students: {},
        total: 0,
      }
    );

    return batch.commit();
  };

  classMini = (classData) => {
    return {
      name: classData.name,
      image: classData.image,
    };
  };
  deleteClass = (class_id) => {
    var batch = this.db.batch();
    batch.delete(this.db.collection("classes").doc(class_id));
    batch.update(this.db.collection("lookups").doc("classes"), {
      [class_id]: app.firestore.FieldValue.delete(),
    });
    batch.delete(
      this.db
        .collection("classes")
        .doc(class_id)
        .collection("data")
        .doc("students1")
    );

    return batch.commit();
  };
  getClass = (class_id) => {
    return this.db.collection("classes").doc(class_id).get();
  };
  addTeacherToClass = (class_id, selectedTeachers) => {
    var batch = this.db.batch();
    selectedTeachers.map((selectedTeacher) => {
      const teacher_id = selectedTeacher.id;
      batch.update(this.db.collection("classes").doc(class_id), {
        teachers: app.firestore.FieldValue.arrayUnion(teacher_id),
      });
      batch.update(this.db.collection("teacher").doc(teacher_id), {
        class_ids: app.firestore.FieldValue.arrayUnion(class_id),
      });
      batch.set(
        this.db
          .collection("classes")
          .doc(class_id)
          .collection("attendances")
          .doc(teacher_id),
        {}
      );
    });

    return batch.commit();
  };
  removeTeacherFromClass = (class_id, teacher_id) => {
    var batch = this.db.batch();
    batch.update(this.db.collection("classes").doc(class_id), {
      teachers: app.firestore.FieldValue.arrayRemove(teacher_id),
    });
    batch.update(this.db.collection("teacher").doc(teacher_id), {
      class_ids: app.firestore.FieldValue.arrayRemove(class_id),
    });
    batch.delete(
      this.db
        .collection("classes")
        .doc(class_id)
        .collection("attendances")
        .doc(teacher_id)
    );
    return batch.commit();
  };

  getTeachersClasses = () => {
    console.log("uid", this.auth.currentUser.uid);
    return this.db
      .collection("classes")
      .where("teachers", "array-contains-any", [this.auth.currentUser.uid])
      .get();
  };

  getClassStudents = (class_id) => {
    return this.db
      .collection("classes")
      .doc(class_id)
      .collection("data")
      .doc("students1")
      .get();
  };

  generateStudentKey = () => {
    return this.db.collection("students").doc().id;
  };
  addStudent = (id, user) => {
    if (user.class_ids.length !== 0) {
      var batch = this.db.batch();
      user.class_ids.map((class_id) => {
        const classRef = this.db
          .collection("class")
          .doc(class_id)
          .collection("data")
          .doc("students1");
        batch.update(classRef, {
          ["numberOfSells." + fromWhereNew]: incrementByOne,
          totalCurrent: incrementByCommision,
          totalNumberOfSells: incrementByOne,
        });
      });
      batch.set(this.db.collection("student").doc(id), user);
      return batch.commit();
    } else {
      return this.db.collection("student").doc(id).set(user);
    }
  };
  addNewStudentByTeacher = (id, class_id, user) => {
    console.log("selectedStudents", user);
    var batch = this.db.batch();
    const classRef = this.db
      .collection("classes")
      .doc(class_id)
      .collection("data")
      .doc("students1");
    batch.update(classRef, {
      ["students." + id]: user,
      total: app.firestore.FieldValue.increment(1),
    });
    batch.update(this.db.collection("lookups").doc("students"), {
      [id]: this.studentMini(user),
    });
    batch.set(this.db.collection("students").doc(id), {
      ...user,
      class_ids: [class_id],
    });
    user.parents.map((parent_id) => {
      batch.update(this.db.collection("parents").doc(parent_id), {
        students: app.firestore.FieldValue.arrayUnion(id),
      });
    });
    return batch.commit();
  };
  studentMini = (studentData) => {
    return {
      name: studentData.name,
      image: studentData.image,
    };
  };
  getCurrentTeacherAttendance = (class_id) => {
    return this.db
      .collection("classes")
      .doc(class_id)
      .collection("attendances")
      .doc(this.auth.currentUser.uid)
      .get();
  };
  takeAttendanceByTeacher = (attendance, class_id) => {
    var batch = this.db.batch();
    const classRef = this.db
      .collection("classes")
      .doc(class_id)
      .collection("attendances")
      .doc(this.auth.currentUser.uid);
    batch.set(
      classRef,
      {
        [new Date().getTime().toString()]: {
          attendance: attendance,
          time:
            app.firestore.FieldValue.serverTimestamp() || new Date().getTime(),
        },
      },
      { merge: true }
    );
    return batch.commit();
  };
  getStudent = (id) => {
    return this.db.collection("students").doc(id).get();
  };
  updateStudentProfile = (id, updates) => {
    return this.db.collection("student").doc(id).update(updates);
  };
  getStudentParents = (student_id) => {
    return this.db
      .collection("parents")
      .where("students", "array-contains-any", [student_id])
      .get();
  };
  getParentStudents = () => {
    parent_id = this.auth.currentUser.uid;
    return this.db
      .collection("students")
      .where("parents", "array-contains-any", [parent_id])
      .get();
  };
}

const firebase = new Firebase();

export default firebase;

/* import firebase from "@firebase/app";
import "@firebase/auth";
import Constants from "expo-constants";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBO6ETzVAkmX3l2FAorcgA2qhDd1702o5k",
  authDomain: "schoolgo-19532.firebaseapp.com",
  projectId: "schoolgo-19532",
  storageBucket: "schoolgo-19532.appspot.com",
  messagingSenderId: "874259621131",
  appId: "1:874259621131:web:d8530db1b69d4e317a6e0e",
  //measurementId: "G-RLWL8CL7N5",
};

let Firebase;

if (firebase.apps.length === 0) {
  Firebase = firebase.initializeApp(firebaseConfig);
}

export default Firebase; */
