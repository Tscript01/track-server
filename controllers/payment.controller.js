import mongoose from 'mongoose';
import axios from 'axios';
import User from '../models/user.model.js';
import Payment from '../models/payment.model.js';
import { subscriptionPlans } from '../helpers/subcriptionplan.js';



export const initializePayment = async (req, res, next) => {
    const { subscriptionPlan } = req.body
  try {
    const user_id = req.user?._id;
    const userExists = await User.findById(user_id);

    if (!userExists) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
const plan = subscriptionPlans[subscriptionPlan];
      const totalPrice = plan.amount
      

    const paystackResponse = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: userExists.email,
        amount: totalPrice * 100,
        currency: 'NGN',
        reference: `subscribe_${user_id}_${Date.now()}`,
        callback_url: `${process.env.FRONTEND_URL}/enrollment/verify`,
        metadata: {
            user_id: user_id,
            subscriptionPlan:plan.name
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const payment = new Payment({
      user: user_id,
      amount: totalPrice,
      currency: 'NGN',
      reference: paystackResponse.data.data.reference,
      status: 'pending',
      paymentMethod: 'bank_transfer',
    });

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        ...paystackResponse.data.data,
        totalPrice: totalPrice,
      },
    });
  } catch (err) {
    console.error('Payment initialization error:', err);
    if (err.response) {
      return res.status(400).json({
        success: false,
        message: 'Payment initialization failed',
        error: err.response.data.message,
      });
    }
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {

  try {
    const { reference } = req.body;
    if (!reference) {
      return res
        .status(400)
        .json({ success: false, message: 'Payment reference is required' });
    }

    const payment = await Payment.findOne({ reference });
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: 'Payment record not found' });
    }

    if (payment.status === 'success') {
      return res
        .status(400)
        .json({ success: false, message: 'Payment already processed' });
    }

    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    const { data: transactionData } = paystackResponse.data;
    if (transactionData.status !== 'success') {
      return res
        .status(400)
        .json({ success: false, message: 'Payment not successful' });
    }
    payment.status = 'success';
    payment.paidAt = new Date();
      payment.transactionId = transactionData.id;
      const user_id = transactionData.metadata.user_id;
      const user = await User.findOne({ _id: user_id })
      const planduration =  subscriptionPlans[transactionData.metadata.subscriptionPlan];
      const expiresAt = new Date(
        Date.now() + planduration.duration * 24 * 60 * 60 * 1000
      );

      user.isSubscribed = true
      user.subscriptionPlan = transactionData.metadata.subscriptionPlan;
      user.subscriptionExpires = expiresAt;
      await payment.save();
      await user.save()
    res.status(201).json({
      success: true,
      message: `Payment verified and You have sucessfully subscribed to ${transactionData.metadata.subscriptionPlan} plan`,
      data: {
        transactionData,
        payment,
      },
    });
  } catch (err) {
   
    console.error('Payment verification error:', err);
    if (err.response) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        error: err.response.data.message,
      });
    }
    next(err);
  }
};

export const getPaymentHistory = async (req, res, next) => {

  try {
    const user= req.user?._id
    const paymentHistory = await Payment.find({ user })

    if (!paymentHistory || paymentHistory.length === 0) {
      return res.status(404).json({
        message: 'No Payment History found for this User',
      });
    }

    res.status(200).json({
      message: 'payment History retived Successfully ',
      paymentHistory,
    });
  } catch (error) {
    next(error)
    
  }
}
export const getAllPaymentHistory = async (req, res, next) => {
  try {
    const {} = req.params;
  } catch (error) {}
};

// export const getPaymentStatus = async (req, res, next) => {
//   try {
//     const { reference } = req.params;

//     const payment = await Payment.findOne({ reference })
//       .populate('student', 'firstName lastName email')
//       .populate('courses', 'courseName price');

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: payment,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
// export const getPaymentHistory = async (req, res, next) => {
//   try {
//     const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
//     const skip = (page - 1) * limit;
//     const studentId = req.params.studentId;

//     const payments = await Payment.find({
//       student: studentId,
//       status: 'success',
//     })
//       .populate('student', 'firstName lastName email')
//       .populate('courses', 'courseName description price instructor thumbnail')
//       .sort(sort)
//       .limit(parseInt(limit))
//       .skip(skip);

//     const total = await Payment.countDocuments({
//       student: studentId,
//       status: 'success',
//     });

//     const allPayments = await Payment.find({
//       student: studentId,
//       status: 'success',
//     });
//     console.log(allPayments);
//     const statistics = {
//       totalPurchases: allPayments.length,
//       totalAmount: allPayments.reduce(
//         (sum, payment) => sum + payment.amount,
//         0
//       ),
//       totalCourses: allPayments.reduce(
//         (sum, payment) => sum + payment.courses.length,
//         0
//       ),
//       averageOrderValue:
//         allPayments.length > 0
//           ? Math.round(
//               allPayments.reduce((sum, payment) => sum + payment.amount, 0) /
//                 allPayments.length
//             )
//           : 0,
//     };

//     res.status(200).json({
//       success: true,
//       data: payments,
//       statistics,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(total / limit),
//         totalPayments: total,
//         hasNextPage: page * limit < total,
//         hasPrevPage: page > 1,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// };
