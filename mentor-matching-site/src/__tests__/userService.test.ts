/*
User ServiceTesting Suite
* Tests userService functions, which are abstracts of the userDB functions.
* All tests can be run by executing 'npm test' within the main directory.
*/

// Create mock versions of the userDB functions that userService relies on:
jest.mock('../dal/userDb', () => {
  const mockUserDb = {
    createNewUserAsync:     jest.fn(),
    getUserProfileAsync:    jest.fn(),
    updateUserProfileAsync: jest.fn(),
    updateUserProfileImage: jest.fn(),
    userExistsAsync:        jest.fn(),
    deleteUserProfileAsync: jest.fn(),
    getAllUserProfilesAsync: jest.fn(),
    getAllPendingUsersAsync: jest.fn(),
    deletePendingUserAsync: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockUserDb,
    ...mockUserDb
  };
});


// Import the needed functions that we are looking to test:
import userDb from '../dal/userDb';
import userService from '../service/userService';
import { initUserProfile, UserProfile } from '../types/userProfile';

// Create a mock user profile for testing:
const mockUser = (overrides = {}) => ({
  uid:           'test-uid-123',
  email:         'beaver@oregonstate.edu',
  emailVerified: true,
  reload:        jest.fn(),
  ...overrides,
});

const mockUserProfile = (): UserProfile => ({
  ...initUserProfile(),
  UID: 'test-uid-123',
  contact: {
    email:       'beaver@oregonstate.edu',
    displayName: 'Test Beaver',
    pronouns:    'they/them',
    timeZone:    'America/Los_Angeles',
    userBio: ""
  },
  personal: {
    firstName:         'Test',
    lastName:          'Beaver',
    middleName:        'the',
    credentials:       '',
    currentProfession: '',
    collegeYear:       '',
    degreeProgram:     '',
  },
  availability:    { hoursPerWeek: '5' },
  preferences:     { role: 'Mentee' },
  accountSettings: {
    userStatus:          'active',
    menteePortalEnabled: true,
    mentorPortalEnabled: false,
  },
  matchHistory:      [],
  profilePictureUrl: '',
});

// ─────────────────────────────────────────────────────────────
// 7. userService — properly makes calls to userDb
// ─────────────────────────────────────────────────────────────

describe('userService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('createNewUser makes a call to userDb.createNewUserAsync', async () => {
    await userService.createNewUser(mockUser() as any, mockUserProfile());
    expect(userDb.createNewUserAsync).toHaveBeenCalledWith(
      expect.objectContaining({ uid: 'test-uid-123' }),
      expect.objectContaining({ UID: 'test-uid-123' })
    );
  });

  it('getUserProfile makes a call to userDb.getUserProfileAsync', async () => {
    (userDb.getUserProfileAsync as jest.Mock).mockResolvedValue(mockUserProfile());

    const result = await userService.getUserProfile('test-uid-123');

    expect(userDb.getUserProfileAsync).toHaveBeenCalledWith('test-uid-123');
    expect(result).toEqual(mockUserProfile());
  });

  it('userExists makes a call to userDb.userExistsAsync', async () => {
    (userDb.userExistsAsync as jest.Mock).mockResolvedValue(true);

    const result = await userService.userExists('beaver@oregonstate.edu');

    expect(userDb.userExistsAsync).toHaveBeenCalledWith('beaver@oregonstate.edu');
    expect(result).toBe(true);
  });

  it('deleteUserProfile logs success on resolve', async () => {
    (userDb.deleteUserProfileAsync as jest.Mock).mockResolvedValue(undefined);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await userService.deleteUserProfile('test-uid-123');

    expect(consoleSpy).toHaveBeenCalledWith('User profile deleted successfully.');
    consoleSpy.mockRestore();
  });

  it('deleteUserProfile throws and logs error on failure', async () => {
    const err = new Error('DB error');
    (userDb.deleteUserProfileAsync as jest.Mock).mockRejectedValue(err);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(userService.deleteUserProfile('test-uid-123')).rejects.toThrow('DB error');
    expect(consoleSpy).toHaveBeenCalledWith('Error deleting user profile:', err);
    consoleSpy.mockRestore();
  });
});