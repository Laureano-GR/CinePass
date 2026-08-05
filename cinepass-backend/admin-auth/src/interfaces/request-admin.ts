import { Request } from 'express';
import { AdminEntity } from 'src/entities/admin.entity';

export interface RequestWithAdmin extends Request {
  admin: AdminEntity;
}
