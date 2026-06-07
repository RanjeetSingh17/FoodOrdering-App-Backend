// const admin = require('firebase-admin');
// admin.initializeApp({
//   credential: admin.credential.cert(require('../config/serviceKey.json')),
// });
// const verifyToken = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(403).json({ error: 'Unauthorized' });
//   }

//   const token = authHeader.split('Bearer ')[1];

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     const uid = decodedToken.uid;
//     req.user = { uid };
//     next();
//   } catch (error) {
//     console.error('Error verifying token:', error.message);
//     return res.status(403).json({ error: 'Invalid or expired token' });
//   }
// };
 
// module.exports= verifyToken

const admin = require('firebase-admin');

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid };
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;