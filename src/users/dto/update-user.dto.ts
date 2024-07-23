import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * Data transfer object for update user, extends the create userdto
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
