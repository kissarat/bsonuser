import { Injectable } from "@nestjs/common";
import { StorageService } from "../storage.service";
import { User, UserSearchable } from "common/models/User";

@Injectable()
export class UserService extends StorageService<User, UserSearchable> {
}
