import { UserManager } from '../userManager';
import { UserService } from './UserService';

describe('UserService', () => {
  let userService: UserService;
  let userManager: UserManager;
  let addUserMock: jest.Mock;
  let getUsersMock: jest.Mock;

  beforeEach(() => {
    userManager = new UserManager();
    addUserMock = jest.fn();
    getUsersMock = jest.fn();
    userManager.addUser = addUserMock;
    userManager.getUsers = getUsersMock;
    userService = new UserService(userManager);
  });

  describe('createUser', () => {
    it.each([
      { username: '', age: 46, errorMessage: 'Username cannot be empty' },
      { username: 'user#5651', age: 25, errorMessage: 'Username is invalid, it must contain only alphanumeric characters' }
    ])('should throw an exception if username is invalid', async ({ username, age, errorMessage }) => {
      const userInput = { username, age };
      await expect(userService.createUser(userInput)).rejects.toThrow(errorMessage);    
      expect(addUserMock).not.toBeCalled();
    });

    it.each([
      { age: -19, errorMessage: 'Age must be a positive integer' },
      { age: 0, errorMessage: 'Age must be a positive integer'},
      { age: 19.5, errorMessage: 'Age must be a positive integer' }
    ])('should throw an exception if age is not a positive integer', async ({ age, errorMessage }) => {
      const userInput = { username: 'mike', age };
      await expect(userService.createUser(userInput)).rejects.toThrow(errorMessage);    
      expect(addUserMock).not.toBeCalled();
    });

    it('should call addUser of UserManager if userInput is valid', async () => {
      const userInput = { username: 'mike', age: 32 };
      await userService.createUser(userInput);
      expect(addUserMock).toBeCalled();
    });

    it.each([
      { age: 32, expectedIsAdult: true },
      { age: 15, expectedIsAdult: false }
    ])('should set isAdult correctly based on age', async ({ age, expectedIsAdult }) => {
      const userInput = { username: 'mike', age };
      const newUser = await userService.createUser(userInput);
      expect(newUser.isAdult).toBe(expectedIsAdult);
      expect(addUserMock).toBeCalled();
    });
  });

  describe('getUsersAverageAge', () => {
    it('should call getUsers of UserManager and calculate average age correctly', async () => {
      const users = [
        { id: 1, username: 'Lisa', age: 28, isAdult: true },
        { id: 2, username: 'Mike', age: 32, isAdult: true },
        { id: 3, username: 'JB', age: 36, isAdult: true },
        { id: 4, username: 'Chris', age: 24, isAdult: true },
      ];
      getUsersMock.mockReturnValueOnce(users);

      const expectedAverageAge = (28 + 32 + 36 + 24) / 4;

      const averageAge = await userService.getUsersAverageAge();

      expect(getUsersMock).toBeCalled();
      expect(averageAge).toEqual(expectedAverageAge);
    });
  });
});
