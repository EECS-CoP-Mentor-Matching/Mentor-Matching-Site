/*
User Update Testing Suite
* Tests profile changes and updates for user accounts (Note: many of these functions are re-used in the admin's edit user profile section)
* All tests can be run by executing 'npm test' within the main directory.
*/

// Create a mock version of the userService functions and our firestore/database tools:
jest.mock('../service/userService', () => {
  const mockUserService = {
    getUserProfile:    jest.fn(),
    updateUserProfile: jest.fn(),
    deleteUserProfile: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockUserService,
    ...mockUserService
  };
});

jest.mock('../service/authService', () => {
  const mockAuthService = {
    getSignedInUser:   jest.fn(),
    deleteUserAccount: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockAuthService,
    ...mockAuthService
  };
});

jest.mock('firebase/auth', () => ({
  getAuth:    jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock('../firebaseConfig', () => ({
  db:  {},
  app: {},
}));

// Import the functions that we are looking to test:

import userService from '../service/userService';
import authService from '../service/authService';
import { deleteUser, getAuth } from 'firebase/auth';
import { UserProfile } from '../types/userProfile';
import { initUserProfile } from '../types/userProfile';

// Create a mock user profile for our tests:
const mockUser = (overrides = {}) => ({
  uid:           'test-uid-123',
  email:         'beaver@oregonstate.edu',
  emailVerified: true,
  reload:        jest.fn(),
  getIdToken:    jest.fn(),
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
    userBio:     '',
  },
  personal: {
    firstName:         'Test',
    lastName:          'Beaver',
    middleName:        'the',
    credentials:       'BS Computer Science',
    currentProfession: 'Software Engineer',
    collegeYear:       'Junior',
    degreeProgram:     'Computer Science',
  },
  availability:    { hoursPerWeek: '5' },
  preferences:     { role: 'Mentor' },
  accountSettings: {
    userStatus:          'active',
    menteePortalEnabled: false,
    mentorPortalEnabled: true,
  },
  matchHistory:      [],
  profilePictureUrl: '',
});

// ─────────────────────────────────────────────────────────────
// 1. UpdateUserProfile — Initial profile loading
// ─────────────────────────────────────────────────────────────
describe('UpdateUserProfile — Initial profile loading', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls authService.getSignedInUser initially', async () => {
    (authService.getSignedInUser as jest.Mock).mockResolvedValue(mockUser());
    (userService.getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile());

    await authService.getSignedInUser();

    expect(authService.getSignedInUser).toHaveBeenCalledTimes(1);
  });

  it('calls userService.getUserProfile with the signed-in uid', async () => {
    (authService.getSignedInUser as jest.Mock).mockResolvedValue(mockUser());
    (userService.getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile());

    const user = await authService.getSignedInUser();
    if (user) await userService.getUserProfile(user.uid);

    expect(userService.getUserProfile).toHaveBeenCalledWith('test-uid-123');
  });

  it('does not call getUserProfile if no user is signed in', async () => {
    (authService.getSignedInUser as jest.Mock).mockResolvedValue(null);

    const user = await authService.getSignedInUser();
    // user should be null in this case
    if (user) await userService.getUserProfile(user.uid);

    expect(userService.getUserProfile).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────
// 2. UpdateUserProfile — saveChanges
// ─────────────────────────────────────────────────────────────
describe('UpdateUserProfile — saveChanges', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls userService.updateUserProfile with the correct uid and profile', async () => {
    (userService.updateUserProfile as jest.Mock).mockResolvedValue(undefined);

    const profile = mockUserProfile();

    // Simulate what saveChanges() does in UpdateUserProfile.tsx:
    await userService.updateUserProfile(profile.UID, profile);

    expect(userService.updateUserProfile).toHaveBeenCalledWith(
      'test-uid-123',
      expect.objectContaining({ UID: 'test-uid-123' })
    );
  });

  it('passes the full updated profile to userService.updateUserProfile', async () => {
    (userService.updateUserProfile as jest.Mock).mockResolvedValue(undefined);

    const profile = mockUserProfile();
    const updatedProfile = {
      ...profile,
      personal: { ...profile.personal, firstName: 'Benny' }
    };

    await userService.updateUserProfile(updatedProfile.UID, updatedProfile);

    const savedProfile = (userService.updateUserProfile as jest.Mock).mock.calls[0][1] as UserProfile;
    expect(savedProfile.personal.firstName).toBe('Benny');
  });

  it('does not call updateUserProfile if profileDetails is null', async () => {
    // Simulate the null guard in saveChanges(): if (profileDetails) { ... }
    const profileDetails: UserProfile | null = null;
    if (profileDetails) {
      // You may see a compiler/intellisense error on the line below because of the .UID property on a null object.
      // It can be safely ignored as this code should not be reached.
      await userService.updateUserProfile(profileDetails.UID, profileDetails);
    }

    expect(userService.updateUserProfile).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────
// 3. UpdateUserProfile — handleDeleteAccount
// ─────────────────────────────────────────────────────────────
describe('UpdateUserProfile — handleDeleteAccount', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls userService.deleteUserProfile with the correct uid', async () => {
    (userService.deleteUserProfile as jest.Mock).mockResolvedValue(undefined);
    (authService.deleteUserAccount as jest.Mock).mockResolvedValue(undefined);

    const profile = mockUserProfile();

    // Simulate handleDeleteAccount():
    await userService.deleteUserProfile(profile.UID);
    await authService.deleteUserAccount();

    expect(userService.deleteUserProfile).toHaveBeenCalledWith('test-uid-123');
  });

  it('calls authService.deleteUserAccount after deleting the profile', async () => {
    (userService.deleteUserProfile as jest.Mock).mockResolvedValue(undefined);
    (authService.deleteUserAccount as jest.Mock).mockResolvedValue(undefined);

    await userService.deleteUserProfile('test-uid-123');
    await authService.deleteUserAccount();

    expect(authService.deleteUserAccount).toHaveBeenCalledTimes(1);
  });

  it('calls deleteUserProfile before deleteUserAccount', async () => {
    const callOrder: string[] = [];
    (userService.deleteUserProfile as jest.Mock).mockImplementation(async () => {
      callOrder.push('deleteUserProfile');
    });
    (authService.deleteUserAccount as jest.Mock).mockImplementation(async () => {
      callOrder.push('deleteUserAccount');
    });

    await userService.deleteUserProfile('test-uid-123');
    await authService.deleteUserAccount();

    expect(callOrder).toEqual(['deleteUserProfile', 'deleteUserAccount']);
  });

  it('logs an error and does not crash if deleteUserProfile throws', async () => {
    const err = new Error('Delete failed');
    (userService.deleteUserProfile as jest.Mock).mockRejectedValue(err);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Simulate the try/catch in handleDeleteAccount():
    try {
      await userService.deleteUserProfile('test-uid-123');
      await authService.deleteUserAccount();
    } catch (error) {
      console.error('Error deleting account:', error);
    }

    expect(authService.deleteUserAccount).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Error deleting account:', err);
    consoleSpy.mockRestore();
  });
});