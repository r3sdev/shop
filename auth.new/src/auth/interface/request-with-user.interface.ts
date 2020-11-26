import { User } from "src/common/models";

export interface RequestWithUser extends Request {
    user: User
}
