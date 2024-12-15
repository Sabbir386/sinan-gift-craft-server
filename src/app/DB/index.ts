import config from '../config';
import { USER_ROLE } from '../User/user.constant';
import { User } from '../User/user.model';

const superUser = {
  id:"S-0001",
  username: 'sabbir Ahmed',
  email: 'sabbir386.sa@gmail.com',
  password: config.super_admin_password,
  role: USER_ROLE.superAdmin,
  needsPasswordChange: false,
  status: 'active',
  isDeleted: false,
  country: 'Bangladesh',
};
const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExits = await User.findOne({ role: USER_ROLE.superAdmin });
  if (!isSuperAdminExits) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
