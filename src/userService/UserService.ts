import { UserManager } from '../userManager/index';
import { UserInput } from './userInput';
import { User } from './users';

export class UserService {

    public constructor(private userManager: UserManager) {}

    public async createUser (userInput : UserInput): Promise<User> {
        if (userInput.username === '') {
            throw new Error('Username cannot be empty');
        }
        if (!/^[a-zA-Z0-9]+$/.test(userInput.username)) {
            throw new Error('Username is invalid, it must contain only alphanumeric characters');
        }
        
        if (userInput.age <= 0 || !Number.isInteger(userInput.age)) {
            throw new Error('Age must be a positive integer');
        } 



        const newUser = {
            id: Math.floor(Math.random() * 1000),
            username: userInput.username,
            age: userInput.age,
            isAdult: userInput.age >= 18
        };

        const userAdd = await this.userManager.addUser(newUser);
        
        return newUser;
    }

    public async getUsersAverageAge(): Promise<number> {
        const users = await this.userManager.getUsers();
        
        if (users.length === 0) {
            return 0;
        }
        
        const totalAge = users.reduce((total, user) => total + user.age, 0);
        return totalAge / users.length;
    }
}

