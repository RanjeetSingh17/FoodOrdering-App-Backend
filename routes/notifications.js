// const express = require('express');
// const router = express.Router();
// const admin = require('../firebaseadmin');

// router.post('/subscribe-to-topic', async (req, res) => {
//     try {
//         const { token } = req.body;
        
//         if (!token) {
//             return res.status(400).json({ error: 'Token is required' });
//         }
        
//         await admin.messaging().subscribeToTopic([token], 'newItems');
        
//         res.status(200).json({ 
//             message: 'Successfully subscribed to notifications',
//             token: token
//         });
//     } catch (error) {
//         console.error('Error subscribing to topic:', error);
//         res.status(500).json({ 
//             error: 'Failed to subscribe to notifications',
//             details: error.message
//         });
//     }
// });

// module.exports = router;