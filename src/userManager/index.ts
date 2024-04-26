import { singleton } from "tsyringe";
import { UserDB } from "./userDB";

@singleton()
export class UserManager {
  private users: UserDB[] = [];

  public async addUser(user: Omit<UserDB, "id">): Promise<UserDB> {
    const newUser: UserDB = {
      ...user,
      id: this.users.length + 1,
    };
    await this.fakeDelay();
    this.users.push(newUser);

    return newUser;
  }

  public async getUsers(): Promise<UserDB[]> {
    await this.fakeDelay();
    return this.users;
  }

  private async fakeDelay() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
}
