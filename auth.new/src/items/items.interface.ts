import { FilterQuery } from "mongodb";
import { Item } from "./entity/item";

export interface ItemService {
    findAll(): Promise<Item[]>;
    findById(id: string): Promise<Item | null>;
    findOne(options: FilterQuery<Item>): Promise<Item | null>;
    create(item: Item): Promise<void>;
    update(id: string, updates: Item): Promise<Item | null>;
    delete(id: string): Promise<string>;
}