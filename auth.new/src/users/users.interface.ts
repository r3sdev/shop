import { FilterQuery } from "mongodb";
import { User } from "../common/models";

export interface UsersService {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findOne(options: FilterQuery<User>): Promise<User | null>;
    create(user: User): Promise<void>;
    update(id: string, updates: User): Promise<User | null>;
    delete(id: string): Promise<string>;
}