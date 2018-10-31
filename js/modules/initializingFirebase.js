function initializingFirebase() {
    const config = {
        apiKey: "AIzaSyAXNE7iDnkAnTZ0KjGFmp6l908TZh47x80",
        authDomain: "new-project-si.firebaseapp.com",
        databaseURL: "https://new-project-si.firebaseio.com",
        projectId: "new-project-si",
        storageBucket: "new-project-si.appspot.com",
        messagingSenderId: "999836579478"
    };

    firebase.initializeApp(config);
}
module.exports = initializingFirebase;