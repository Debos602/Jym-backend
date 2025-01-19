import QueryBuilder from '../../builder/QueryBuilder';
import { TCar } from './car.interface';
import CarModel from './car.model';

const createCar = async (car: TCar) => {
  const result = await CarModel.create(car);
  return result;
};

const getAllCar = async (query: Record<string, unknown>) => {
  const allCarQuery = new QueryBuilder(CarModel.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate();

  const result = await allCarQuery.modelQuery;
  const meta = await allCarQuery.countTotal();
  return { result, meta };
};

const getAvailableCar = async () => {
  const result = await CarModel.find({ status: 'available' });
  return result;
};

const getSingleCar = async (id: string) => {
  const result = await CarModel.findById(id);
  return result;
};

const updateCar = async (carId: string, car: TCar) => {
  const result = await CarModel.findByIdAndUpdate(carId, car, { new: true });
  return result;
};

const deleteCar = async (id: string) => {
  const result = await CarModel.findByIdAndDelete(id);
  return result;
};

export const CarServices = {
  createCar,
  getAllCar,
  getSingleCar,
  updateCar,
  deleteCar,
  getAvailableCar,
};
