import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { UserType } from '../constants/userType.constant';
import { UserRegisterDto } from '../dto/userRegister.dto';
import { UsernameAlreadyUsedException } from '../exception/usernameAlreadyUsed.exception';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let mockUserData;

  const userServiceMock = {
    createUser: jest.fn(),
    usernameNotUsed: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock, // Utilisez le mock à la place du vrai service
        },
      ],
    }).compile();
    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

    mockUserData = {
      username: 'usernameTest',
      name: 'Jean',
      surname: 'Vert',
      password: 'MotDePasseS3cU!',
      userType: UserType.STUDENT,
    };
  });

  describe('POST register', () => {
    let mockUserDto: UserRegisterDto;

    beforeEach(() => {
      mockUserDto = new UserRegisterDto();
      mockUserDto.username = mockUserData.username;
      mockUserDto.name = mockUserData.name;
      mockUserDto.surname = mockUserData.surname;
      mockUserDto.password = mockUserData.password;
      mockUserDto.passwordConfirm = mockUserData.password;
      mockUserDto.userType = mockUserData.userType;
    });

    afterEach(() => {
      userServiceMock.createUser.mockClear();
      userServiceMock.usernameNotUsed.mockClear();
    });

    test('should call createUser and return nothing', async () => {
      userServiceMock.usernameNotUsed.mockReturnValue(true);
      await controller.registerUser(mockUserDto);
      expect(userServiceMock.createUser).toHaveBeenCalledWith(
        mockUserDto.username,
        mockUserDto.name,
        mockUserDto.surname,
        mockUserDto.password,
        mockUserDto.userType,
      );
    });

    test('should call throw UsernameAlreadyUsedException', async () => {
      userServiceMock.usernameNotUsed.mockReturnValue(false);
      try {
        await controller.registerUser(mockUserDto);
        fail('Expected the function to throw an exception');
      } catch (error) {
        expect(error).toBeInstanceOf(UsernameAlreadyUsedException);
      }
      expect(userService.createUser).not.toHaveBeenCalled();
    });

    test('should call throw UsernameAlreadyUsedException', async () => {});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
