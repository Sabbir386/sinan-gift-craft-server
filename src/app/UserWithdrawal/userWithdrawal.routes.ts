import express from 'express';
import validateRequest from '../middleware/validateRequest';
import { userWithdrawalValidationSchema } from './userWithdrawal.validation';
import { UserWithdrawalControllers } from './userWithdrawal.controller';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

// Get all user withdrawals
router.get(
    '/',
    // auth(USER_ROLE.superAdmin, USER_ROLE.admin,USER_ROLE.user,USER_ROLE.advertiser),
    UserWithdrawalControllers.getAllWithdrawals,
);

// Get a single user withdrawal
router.get(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    UserWithdrawalControllers.getSingleWithdrawal,
);

// Create a user withdrawal
router.post(
    '/create-withdrawal',
    auth(USER_ROLE.user),
    validateRequest(userWithdrawalValidationSchema),
    UserWithdrawalControllers.createWithdrawal,
);

// Update the status of a withdrawal
router.put(
    '/status/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    UserWithdrawalControllers.updateWithdrawalStatus
  );  

  // Get all withdrawals filtered by status
router.get(
    '/statusFilter/filter-by-status',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    UserWithdrawalControllers.getWithdrawalsByStatus,
);

// Delete a withdrawal
router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    UserWithdrawalControllers.deleteWithdrawal,
);

// Toggle withdrawal status (optional functionality)
router.put(
    '/toggle-status/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    UserWithdrawalControllers.toggleWithdrawalStatus,
);
router.get(
    '/history/user-multiple-withdrawal',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user), 
    UserWithdrawalControllers.getUserMultipleWithdrawalHistory, 
);

export const UserWithdrawalRoutes = router;
