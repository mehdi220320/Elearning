const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../user/User');
const Token = require('./Token');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { adminAuthorization, checkTokenExists } = require('../middlewares/authMiddleware');

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
            role: user.role,
            picture:user.picture
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
        let user = await User.findOne({ email });
        if(!user){
            user = new User({ firstname,lastname, email, phone, password });
            await user.save();
            res.status(201).send({ message: "User saved successfully", user });
        }else {
            throw error("User already Exists")
            res.status(500).send({ message: "User already Exists" });
        }


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
            role: user.role,
            isActive:user.isActive
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
router.post('/register-admin', [checkTokenExists,adminAuthorization], async (req, res) => {
    try {
        const { firstname, lastname, email, password, phone } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send({ message: "User already exists" });
        }

        // Create new admin user
        user = new User({
            firstname,
            lastname,
            email,
            phone,
            password,
            role: 'admin' // Set role to admin
        });

        await user.save();

        // Send email with credentials
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Your Admin Account Credentials',
            text: `Dear ${firstname} ${lastname},\n\nYour admin account has been successfully created.\n\nLogin Details:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after first login for security reasons.\n\nBest regards,\nAdministration Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Admin Account Created Successfully</h2>
                    <p>Dear <strong>${firstname} ${lastname}</strong>,</p>
                    <p>Your admin account has been successfully created.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">Login Details:</h3>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Password:</strong> ${password}</p>
                    </div>
                    
                    <p style="color: #d9534f; font-weight: bold;">⚠️ For security reasons, please change your password after your first login.</p>
                    
                    <p>Best regards,<br>Administration Team</p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777;">This is an automated message. Please do not reply to this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).send({
            message: "Admin user created successfully and credentials sent via email",
            user: {
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (e) {
        console.error('Admin registration error:', e);

        // If user was created but email failed, provide info
        if (user && user._id) {
            return res.status(201).send({
                message: "Admin user created but email failed to send. Please provide credentials manually.",
                user: {
                    _id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    password: password // Include password in response for manual delivery
                },
                warning: "Email delivery failed"
            });
        }

        res.status(500).send({ message: e.message });
    }
});
module.exports = router;