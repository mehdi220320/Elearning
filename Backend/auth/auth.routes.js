const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../user/User');
const Token = require('./Token');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});


const generateResetCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
};

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const resetCode = generateResetCode();
        const resetCodeExpires = new Date(Date.now() + 2 * 60 * 1000);

        user.resetPasswordToken = resetCode;
        user.resetPasswordExpires = resetCodeExpires;
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: user.email,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${resetCode}\n\nThis code will expire in 2 minutes.`,
            html: `
                <div>
                    <h2>Password Reset Request</h2>
                    <p>Your password reset code is: <strong>${resetCode}</strong></p>
                    <p>This code will expire in 15 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: 'Reset code sent to email' });
    } catch (e) {
        console.error('Forgot password error:', e);
        res.status(500).send({ message: 'Error sending reset code' });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordToken: code,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send({ message: 'Invalid or expired reset code' });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).send({ message: 'Password reset successfully' });
    } catch (e) {
        console.error('Reset password error:', e);
        res.status(500).send({ message: 'Error resetting password' });
    }
});

const generateAuthToken = async (user) => {
    const jwtExpiresIn = 60 * 60 * 24;
    const token = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role
        },
        process.env.SECRET_KEY,
        { expiresIn: jwtExpiresIn }
    );

    const tokenDB = new Token({
        userId: user._id,
        token,
        expiresAt: new Date(Date.now() + jwtExpiresIn * 1000)
    });

    await tokenDB.save();
    return { token, expiresIn: jwtExpiresIn };
};

router.post('/register', async (req, res) => {
    try {
        const { firstname,lastname, email, password, phone } = req.body;
        const user = new User({ firstname,lastname, email, phone, password });
        await user.save();
        res.status(201).send({ message: "User saved successfully", user });
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        const { token, expiresIn } = await generateAuthToken(user);
        res.send({
            message: 'User logged in successfully',
            token,
            expiresIn,
            role: user.role
        });
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});

router.post('/google-auth', async (req, res) => {
    try {
        const { credential } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name,family_name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                firstname: name,
                lastname:family_name,
                isActive:true,
                email,
                picture,
                password: 'google-auth',
                isGoogleAuth: true
            });
            await user.save();
        }

        const { token, expiresIn } = await generateAuthToken(user);

        res.send({
            message: 'Google authentication successful',
            token,
            expiresIn,
            role: user.role
        });
    } catch (e) {
        console.error('Google auth error:', e);
        res.status(500).send({ message: 'Google authentication failed' });
    }
});

router.get("/tokenExpired/:token",async (req,res)=>{
    try{
        token = await Token.findOne(req.params.token);


    }catch (e){
        res.status(500).send({ message: 'error : ',e });
    }
});
module.exports = router;