import { UserRole } from 'src/common/entities/role.entity';

export class C_User_Dto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
}
