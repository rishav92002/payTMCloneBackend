
const Account = require("../models/accountModel");



const handleGetBalance = async (req,res)=>{
    try{
        const userId = req.user.id;
        const account = await Account.findOne({userId});

        if(!account){
            return res.status(404).json({message:"Account not found"});
        }
        res.status(200).json({balance:account.balance});
    }catch(err){
        res.status(500).json({message:"Internal Server Error",err});
    }
}

const handleBalanceTransfer = async (req,res)=>{
    try{
        console.log('handleBalanceTransfer initiated');
        const session = await mongoose.startSession();
        console.log('created handleBalanceTransfer initiated');
        session.startTransaction();
        const senderId = req.user.id;
        const {recipientId,amount} = req.body;
        console.log('Transfer details:', {senderId, recipientId, amount});
        if(!recipientId || !amount){
            await session.abortTransaction();
            return res.status(400).json({message:"Recipient ID and amount are required"});
        }
        console.log('handleBalanceTransfer called with:', {senderId, recipientId, amount});
        
        const senderAccount = await Account.findOne({userId:senderId}).session(session);
        const recipientAccount = await Account.findOne({userId:recipientId}).session(session);
        console.log('Sender Account:', senderAccount);
        console.log('Recipient Account:', recipientAccount);
        if(!senderAccount || !recipientAccount){
            await session.abortTransaction();
            return res.status(404).json({message:"Sender or recipient account not found"});
        }
        if(senderAccount.balance < amount){
            await session.abortTransaction();
            return res.status(400).json({message:"Insufficient balance"});
        }
        console.log('Proceeding with balance transfer...');
        await Account.updateOne(
            {userId:senderId},
            {$inc:{balance:-amount}}
        ).session(session);
        await Account.updateOne(
            {userId:recipientId},
            {$inc:{balance:amount}}
        ).session(session);
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({message:"Balance transferred successfully"});


    }catch(err){
        res.status(500).json({message:"Internal Server Error",err});
    }
}



module.exports = {
    handleGetBalance,
    handleBalanceTransfer
};