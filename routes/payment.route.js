import express from 'express';
import { initializePayment,verifyPayment , getPaymentHistory} from '../controllers/payment.controller.js';
import auth from '../middlewares/auth.middleware.js';

const paymentRouter = express.Router();


paymentRouter.post('/initialize',auth, initializePayment);
paymentRouter.post('/verify',auth, verifyPayment);
paymentRouter.get('/paymenthistory', auth, getPaymentHistory);


export default paymentRouter;
