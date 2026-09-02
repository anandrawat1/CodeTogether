const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-token');

const router = express.Router();

router.get('/token', (req, res) => {
    const { channelName, uid } = req.query;

    if (!channelName || uid === undefined) {
        return res.status(400).json({
            error: 'channelName and uid are required'
        });
    }

    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appID || !appCertificate) {
        return res.status(500).json({
            error: 'Agora server configuration missing'
        });
    }

    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs =
        currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
        appID,
        appCertificate,
        channelName,
        Number(uid),
        RtcRole.PUBLISHER,
        privilegeExpiredTs
    );

    return res.json({
        token,
        appId: appID
    });
});

module.exports = router;