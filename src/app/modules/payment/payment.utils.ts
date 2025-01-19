import axios from 'axios';
import { paymentData } from '../order/order.interface';
import { Error } from 'mongoose';

export const initiatPayment = async (paymentData: paymentData) => {
  try {
    const response = await axios.post(process.env.PAYMENT_URL!, {
      store_id: process.env.STORE_ID,
      signature_key: process.env.SIGNATURE_KEY,
      tran_id: paymentData.transactionId,
      success_url: `http://localhost:5000/api/confirmation?transactionId=${paymentData.transactionId}&status=success`,
      fail_url: `http://localhost:5000/api/confirmation?status=failed`,
      cancel_url: 'http://localhost:5000/',
      amount: paymentData.totalCost,
      currency: 'BDT',
      desc: 'Merchant Registration Payment',
      cus_name: paymentData.name,
      cus_email: paymentData.email,
      cus_add1: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1206',
      cus_country: 'Bangladesh',
      cus_phone: paymentData.phone,
      type: 'json',
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed initiating payment');
  }

  // console.log('Payment API response:', response);
};

export const verifyPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(process.env.Payment_verify_url!, {
      params: {
        store_id: process.env.Store_Id,
        signature_key: process.env.Signature_Key,
        type: 'json',
        request_id: tnxId,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed verifying payment');
  }
};
