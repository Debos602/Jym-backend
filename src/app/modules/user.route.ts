import express from 'express';
import { UserController } from './user/user.controller';
import auth from '../Middlewar/auth';
import checkUserExistence from '../Middlewar/checkUserExistence';
import { ClassScheduleController } from './ClassSchedule/classSchedlule.controller';
import { TraineeController } from './trainee/trainee.controller';

const router = express.Router();

router.post('/auth/signup', checkUserExistence, UserController.adminRegister);
router.post('/auth/signin', UserController.adminSignIn);
router.post('/auth/refresh-token', UserController.refreshToken);
router.post('/auth/create-trainer', auth("admin"), checkUserExistence, UserController.createTrainer);
router.get('/auth/all-trainer', auth("admin"), UserController.getAllTrainers);
router.put('/auth/update-trainer', auth("admin"), UserController.updateTrainer);
router.delete('/auth/delete-trainer', auth("admin"), UserController.deleteTrainer);

// class schedule routes
router.post('/schedule-class', auth("admin"), ClassScheduleController.CreateScheduleGymClass);
router.get('/schedule-class', ClassScheduleController.viewAllClassesSchedule);
router.get('/schedule-class/:trainerId', ClassScheduleController.ViewAssignedClassSchedules);

// trainee routes
router.post('/create-trainee', checkUserExistence, TraineeController.createTraineeProfile);
router.post('/trainee-booking', TraineeController.handleBookClassSchedule);
router.put('/update-trainee', checkUserExistence, TraineeController.updateTraineeProfile);
router.get('/get-trainee-booking', TraineeController.getAllBookings);




export const UserRoutes = router;
