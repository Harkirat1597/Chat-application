require("dotenv").config();
const express = require("express");
const { body, validationResult } = require('express-validator');
const { StreamChat } = require("stream-chat");

const router = express.Router();

const streamChat = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_SECRET_KEY);

const USERS_MAP = new Map();

router.post('/signup',
    body('id').isLength({ min: 3 }),
    body('name').isLength({ min: 1 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, error: errors.array() });
            }

            let { id, name, image } = req.body;
            if (!image) image = "";

            const existingUser = await streamChat.queryUsers({ id });
            if (existingUser.length > 0) return res.status(400).json({ success: false, error: "User already exists!" });

            await streamChat.upsertUser({ id, name, image });
            return res.status(200).json({ success: true, message: "User created successfully" });
        } catch (err) {
            return res.status(500).json({ success: false, error: "Internal server error" });
        }
    })

router.post('/login',
    body('id').isLength({ min: 3 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, error: errors.array() });
            }

            const { id } = req.body;

            const { users: [user] } = await streamChat.queryUsers({ id });
            if (user == null) return res.status(401).json({ success: false, error: "No user, create your account" });

            const token = await streamChat.createToken(id);
            USERS_MAP.set(token, user.id);

            return res.status(200).json({ success: true, token, user: { ...user } });
        } catch (err) {
            return res.status(500).json({ success: false, error: "Internal server error" });
        }
    })

router.post('/logout',
    body('token').isLength({ min: 5 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, error: errors.array() });
            }

            const { token } = req.body;

            const id = USERS_MAP.get(token);

            if (!id) return res.status(400).json({success: false, error: ""});

            await streamChat.revokeUserToken(id, new Date());
            USERS_MAP.delete(token);

            return res.status(200).json({success: true, message: "User logged out"});
        } catch (err) {
            return res.status(500).json({ success: false, error: "Internal server error" });
        }
    }
)
module.exports = router;