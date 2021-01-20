const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.checkAlias = functions.https.onCall((data, context) => {
    //variable to the database reference
    const ref = admin.firestore().collection("users").doc(data.slug)
    return ref.get()
    .then(doc => {
        //check if its unique
        //we get the doc back. if the document exists, then its true. that means alias is not unique
        return { unique: !doc.exists }
    })
    .catch(err => {
        throw new functions.https.httpsError("Falied to connect")
    })
})