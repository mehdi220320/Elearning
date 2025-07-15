const express=require('express')
const  User=require('./User');
const mongoose = require('mongoose');

const router=express.Router();
const { adminAuthorization,checkTokenExists } = require('../middlewares/authMiddleware');


router.get('/all',[adminAuthorization,checkTokenExists],async (req,res)=>{
    try {
        const  users = await User.find()
        res.send(users)
    }catch (e){
        res.send(e)
    }
})

router.get('/:email',adminAuthorization,async (req,res)=>{
    try {
        const  user = await User.findOne({email:req.params.email})
        if(!user){
            res.status(404).send({message:"user not found"})
        }
        res.send(user)
    }catch (error){
        res.send({error:error})
    }
})
router.put('/isActive/:id', [adminAuthorization, checkTokenExists], async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isActive = user.isActive === undefined ? true : !user.isActive;

        user.markModified('isActive');

        const updatedUser = await user.save();

        const { isActive, _id, email } = updatedUser;
        res.status(200).json({
            message: 'User status updated successfully',
            user: { _id, email, isActive }
        });

    } catch (error) {
        console.error('Error updating user status:', error);

        const errorMessage = 'Failed to update user status';

        res.status(500).json({ error: errorMessage });
    }
});
router.delete('/delete/:id',[adminAuthorization,checkTokenExists],async (req,res)=>
{
    try {
        await  User.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).send({ error: "User not found" });
        }
        res.status(200).send({message:"user deleted successfully"})
    } catch (error){
        res.status(400).send({error:error})
    }
})
module.exports=router