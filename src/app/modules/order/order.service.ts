import { initiatPayment } from '../payment/payment.utils';
import { TOrder } from './order.interface';
import OrderModel from './order.model';

const createOrder = async (data: TOrder) => {
  try {
    // Generate transactionId before creating the order
    const transactionId: string = `TXN-${Date.now()}`; // Ensure transactionId is a string

    // Include transactionId in the order data
    const orderData = {
      ...data,
      transactionId, // Add transactionId to the order
    };

    // Create the order
    const result = await OrderModel.create(orderData);
    console.log('Order created:', result);

    // Ensure that result.transactionId is defined
    if (!result.transactionId) {
      throw new Error('Transaction ID is missing');
    }

    // Prepare payment data for initiating payment
    const paymentData = {
      transactionId: result.transactionId, // This is guaranteed to be a string
      totalCost: result.totalCost,
      name: result.name,
      email: result.email,
      phone: result.phone,
    };

    // Initiate the payment session
    const paymentSession = await initiatPayment(paymentData);

    return paymentSession;
  } catch (error) {
    console.error('Error creating order or initiating payment:', error);
    throw new Error('Failed to create order');
  }
};

const getOrder = async () => {
  try {
    const order = await OrderModel.find();
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }
};

const updateOrder = async (email: string, order: TOrder) => {
  try {
    const result = await OrderModel.findOneAndUpdate(
      { email }, // Find the order by email field
      order, // Update with the new order details
      { new: true }, // Return the updated document
    );
    return result;
  } catch (error) {
    console.error('Error updating order:', error);
    throw new Error('Failed to update order');
  }
};

export const OrderServices = {
  createOrder,
  getOrder,
  updateOrder,
};
