/*
UserDB Testing Suite
* Tests functions that interact more directly with our database (userDB).
* All tests can be run by executing 'npm test' within the main directory.
*/

// Create mock database calls to test our functions in an isolated environment (Does NOT affect the real database):
jest.mock('firebase/firestore', () => ({
  collection:   jest.fn(),
  getDocs:      jest.fn(),
  doc:          jest.fn(),
  query:        jest.fn(),
  where:        jest.fn(),
  setDoc:       jest.fn(),
  updateDoc:    jest.fn(),
  deleteDoc:    jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('../firebaseConfig', () => ({
  db:  {},
  app: {},
}));

// Set up mock databases to be used in our tests (also will NOT touch the real database)
jest.mock('../dal/mentorDb', () => ({
  default: {
    searchMentorProfilesByUserAsync: jest.fn().mockResolvedValue([]),
    deleteMentorProfileAsync:        jest.fn().mockResolvedValue(undefined),
  }
}));
jest.mock('../dal/menteeDb', () => ({
  default: {
    searchMenteeProfilesByUserAsync: jest.fn().mockResolvedValue([]),
    deleteMenteeProfileByIdAsync:    jest.fn().mockResolvedValue(undefined),
  }
}));

jest.mock('../dal/commonDb', () => ({
  queryMany: jest.fn(),
}));


// Import the needed functions that we are looking to test:
import {
  collection, getDocs, doc, query, where,
  setDoc, updateDoc, deleteDoc,
} from 'firebase/firestore';
import { queryMany } from '../dal/commonDb';
import userDb from '../dal/userDb';
import userService from '../service/userService';
import { initUserProfile, UserProfile } from '../types/userProfile';

// Test user account:

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
// 1. userDb — createNewUserAsync
// ─────────────────────────────────────────────────────────────
describe('userDb.createNewUserAsync', () => {
  // Reset mock databases in between tests so that they don't interfere with each other:
  beforeEach(() => jest.clearAllMocks());

  it('calls setDoc with the correct collection and uid', async () => {
    const mockDocRef = {};
    (doc as jest.Mock).mockReturnValue(mockDocRef);
    (setDoc as jest.Mock).mockResolvedValue(undefined);

    const result = await userDb.createNewUserAsync(mockUser() as any, mockUserProfile());

    expect(setDoc).toHaveBeenCalledTimes(1);
    expect(setDoc).toHaveBeenCalledWith(mockDocRef, expect.objectContaining({
      UID: 'test-uid-123',
    }));
    expect(result).toBe(true);
  });

  it('always sets accountSettings.userStatus to "active"', async () => {
    (doc as jest.Mock).mockReturnValue({});
    (setDoc as jest.Mock).mockResolvedValue(undefined);

    const profile = mockUserProfile();
    (profile.accountSettings as any).userStatus = 'pending'; // Forcefully change from 'active' status
    await userDb.createNewUserAsync(mockUser() as any, profile);

    const savedProfile = (setDoc as jest.Mock).mock.calls[0][1] as UserProfile;
    expect(savedProfile.accountSettings.userStatus).toBe('active'); // Tests that the user profile is switched back to 'active'
  });

  it('initialises matchHistory as an empty array', async () => {
    (doc as jest.Mock).mockReturnValue({});
    (setDoc as jest.Mock).mockResolvedValue(undefined);

    await userDb.createNewUserAsync(mockUser() as any, mockUserProfile());

    const savedProfile = (setDoc as jest.Mock).mock.calls[0][1] as UserProfile;
    expect(savedProfile.matchHistory).toEqual([]);
  });

  it('returns false and logs an error when setDoc throws', async () => {
    (doc as jest.Mock).mockReturnValue({});
    (setDoc as jest.Mock).mockRejectedValue(new Error('Firestore unavailable'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await userDb.createNewUserAsync(mockUser() as any, mockUserProfile());

    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error creating new user:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});

// ─────────────────────────────────────────────────────────────
// 2. userDb — userExistsAsync
// ─────────────────────────────────────────────────────────────
describe('userDb.userExistsAsync', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns true when a matching user is found', async () => {
    (where as jest.Mock).mockReturnValue({});
    (query as jest.Mock).mockReturnValue({});
    (collection as jest.Mock).mockReturnValue({});
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [{ data: () => mockUserProfile() }],
    });

    const result = await userDb.userExistsAsync('beaver@oregonstate.edu');
    expect(result).toBe(true);
  });

  it('returns false when no matching user is found', async () => {
    (where as jest.Mock).mockReturnValue({});
    (query as jest.Mock).mockReturnValue({});
    (collection as jest.Mock).mockReturnValue({});
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    const result = await userDb.userExistsAsync('nonexistant-account@oregonstate.edu');
    expect(result).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// 3. userDb — getUserProfileAsync
// ─────────────────────────────────────────────────────────────
describe('userDb.getUserProfileAsync', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns the found user profile', async () => {
    const profile = mockUserProfile();
    (where as jest.Mock).mockReturnValue({});
    (query as jest.Mock).mockReturnValue({});
    (collection as jest.Mock).mockReturnValue({});
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [{ data: () => profile }],
    });

    const result = await userDb.getUserProfileAsync('test-uid-123');
    expect(result).toEqual(profile);
  });

  it('returns an empty object when no user is found', async () => {
    (where as jest.Mock).mockReturnValue({});
    (query as jest.Mock).mockReturnValue({});
    (collection as jest.Mock).mockReturnValue({});
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    const result = await userDb.getUserProfileAsync('nonexistent-uid');
    expect(result).toEqual({});
  });
});

// ─────────────────────────────────────────────────────────────
// 4. userDb — getAllUserProfilesAsync
// ─────────────────────────────────────────────────────────────
describe('userDb.getAllUserProfilesAsync', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns an array of UserProfile objects', async () => {
    const profile = mockUserProfile();
    (queryMany as jest.Mock).mockResolvedValue({
      results: [{ data: profile }],
    });

    const result = await userDb.getAllUserProfilesAsync();
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(profile);
  });

  it('returns an empty array when there are no profiles', async () => {
    (queryMany as jest.Mock).mockResolvedValue({ results: [] });

    const result = await userDb.getAllUserProfilesAsync();
    expect(result).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────
// 5. userDb — pending users
// ─────────────────────────────────────────────────────────────
describe('userDb — pending users', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAllPendingUsersAsync returns uid + details per record', async () => {
    (queryMany as jest.Mock).mockResolvedValue({
      results: [
        { docId: 'pending-uid-1', data: { email: 'outsider@gmail.com' } },
      ],
    });

    const result = await userDb.getAllPendingUsersAsync();
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      uid:     'pending-uid-1',
      details: { email: 'outsider@gmail.com' },
    });
  });

  it('getAllPendingUsersAsync works correctly with multiple users', async () => {
    (queryMany as jest.Mock).mockResolvedValue({
        results: [
            { docId: 'pending-uid-1', data: { email: 'outsider@gmail.com'} },
            { docId: 'pending-uid-2', data: { email: 'outsider2@gmail.com'} },
        ]
    });

    const result = await userDb.getAllPendingUsersAsync();
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      uid:     'pending-uid-1',
      details: { email: 'outsider@gmail.com' },
    });
    expect(result[1]).toEqual({
      uid:     'pending-uid-2',
      details: { email: 'outsider2@gmail.com' },
    });
  });

  it('deletePendingUserAsync calls deleteDoc on the correct document', async () => {
    const mockDocRef = { id: 'pending-uid-delete' };
    (doc as jest.Mock).mockReturnValue(mockDocRef);
    (deleteDoc as jest.Mock).mockResolvedValue(undefined);

    await userDb.deletePendingUserAsync('pending-uid-delete');

    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
  });
});

// ─────────────────────────────────────────────────────────────
// 6. userDb — updateUserProfileAsync
// ─────────────────────────────────────────────────────────────
describe('userDb.updateUserProfileAsync', () => {
  beforeEach(() => jest.clearAllMocks());

  it('targets the correct db document based on the uid', async () => {
  const mockDocRef = {};
  (doc as jest.Mock).mockReturnValue(mockDocRef);
  (updateDoc as jest.Mock).mockResolvedValue(undefined);
  const profile = mockUserProfile();

  await userDb.updateUserProfileAsync('test-uid-123', profile);

  expect(doc).toHaveBeenCalledWith(
    expect.anything(), // database
    'userProfile',     // collection name
    'test-uid-123'     // uid
  );
});

  it('calls updateDoc with the provided profile data', async () => {
    const mockDocRef = {};
    (doc as jest.Mock).mockReturnValue(mockDocRef);
    (updateDoc as jest.Mock).mockResolvedValue(undefined);

    const profile = mockUserProfile();
    await userDb.updateUserProfileAsync('test-uid-123', profile);

    expect(updateDoc).toHaveBeenCalledWith(mockDocRef, profile);
  });
});
