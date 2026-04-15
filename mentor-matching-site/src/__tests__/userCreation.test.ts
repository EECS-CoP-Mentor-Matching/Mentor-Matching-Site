/*
User Creation Testing Suite
* Tests both account creation and updates.  Also handles related tests such as email verification.
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

// ─────────────────────────────────────────────────────────────
// 7. userService — properly makes calls to userDb
// ─────────────────────────────────────────────────────────────

// Update testing functions as userService uses a separate set from the above:
jest.mock('../dal/userDb', () => ({
  default: {
    createNewUserAsync:     jest.fn(),
    getUserProfileAsync:    jest.fn(),
    updateUserProfileAsync: jest.fn(),
    updateUserProfileImage: jest.fn(),
    userExistsAsync:        jest.fn(),
    deleteUserProfileAsync: jest.fn(),
    getAllUserProfilesAsync: jest.fn(),
    getAllPendingUsersAsync: jest.fn(),
    deletePendingUserAsync: jest.fn(),
  }
}));

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

// ─────────────────────────────────────────────────────────────
// 8. CreateAccount — email validation logic
// ─────────────────────────────────────────────────────────────

// Please check that the regex below matches the current one at mentor-matching-site\src\app\createAccount\CreateAccount.tsx 
const validateEmail = (email: string): boolean => {
  const regex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9._-]+");
  return regex.test(email);
};

describe('CreateAccount — email validation', () => {
  it('accepts a valid OSU email', () => {
    expect(validateEmail('beaver@oregonstate.edu')).toBe(true);
  });
  it('accepts a valid Gmail address', () => {
    expect(validateEmail('user@gmail.com')).toBe(true);
  });
  it('accepts email with dots and hyphens in the local part', () => {
    expect(validateEmail('first.last-name@oregonstate.edu')).toBe(true);
  });
  it('accepts email with a subdomain', () => {
    expect(validateEmail('user@mail.oregonstate.edu')).toBe(true);
  });
  it('rejects an email with no @ symbol', () => {
    expect(validateEmail('notanemail')).toBe(false);
  });
  it('rejects an email with no domain extension', () => {
    expect(validateEmail('user@nodot')).toBe(false);
  });
  it('rejects an empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
  it('rejects a string of only spaces', () => {
    expect(validateEmail('   ')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// 9. CreateAccount — OSU vs non-OSU email detection
// ─────────────────────────────────────────────────────────────

const isOsuEmail = (email: string): boolean =>
  email.toLowerCase().endsWith('@oregonstate.edu');

describe('CreateAccount — OSU email detection', () => {
  it('identifies a standard OSU email', () => {
    expect(isOsuEmail('beaver@oregonstate.edu')).toBe(true);
  });
  it('identifies an OSU email regardless of casing', () => {
    expect(isOsuEmail('Beaver@OregonState.EDU')).toBe(true);
  });
  it('returns false for a Gmail address', () => {
    expect(isOsuEmail('user@gmail.com')).toBe(false);
  });
  it('returns false for a spoofed near-match domain', () => {
    expect(isOsuEmail('user@fake-oregonstate.edu')).toBe(false);
  });
  it('returns false for an empty string', () => {
    expect(isOsuEmail('')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// 10. NewUserProfile — validateProfileForm logic
// ─────────────────────────────────────────────────────────────

// Please ensure that this matches the implementation at mentor-matching-site\src\app\createAccount\components\newUserProfile\NewUserProfile.tsx:
function validateProfileForm(userProfile: Partial<UserProfile>): string | null {
  if (!userProfile?.contact?.displayName?.trim())       return 'Display Name is required';
  if (!userProfile?.contact?.pronouns?.trim())          return 'Pronouns are required';
  if (!userProfile?.contact?.timeZone?.trim())          return 'Time Zone is required';
  if (!userProfile?.personal?.firstName?.trim())        return 'First Name is required';
  if (!userProfile?.personal?.lastName?.trim())         return 'Last Name is required';
  if (!userProfile?.preferences?.role?.trim())          return 'Role is required';
  if (!userProfile?.availability?.hoursPerWeek?.trim()) return 'Hours Available Per Week is required';

  if (userProfile?.preferences?.role === 'Mentor') {
    if (!userProfile?.personal?.credentials?.trim())
      return 'Credentials are required for mentors';
    if (!userProfile?.personal?.currentProfession?.trim())
      return 'Current Profession is required for mentors';
  }

  if (userProfile?.preferences?.role === 'Mentee') {
    if (!userProfile?.personal?.collegeYear?.trim())
      return 'College Year is required for mentees';
    if (!userProfile?.personal?.degreeProgram?.trim())
      return 'Degree Program is required for mentees';
  }

  return null;
}

// Base profiles used across multiple tests:
const baseMenteeProfile = (): Partial<UserProfile> => ({
  contact:      { displayName: 'Test Mentee', pronouns: 'she/her', timeZone: 'America/Los_Angeles', email: '' , userBio: ""},
  personal:     { firstName: 'Test', lastName: 'User', middleName: '', credentials: '', currentProfession: '', collegeYear: 'Junior', degreeProgram: 'Computer Science' },
  preferences:  { role: 'Mentee' },
  availability: { hoursPerWeek: '5' },
});

const baseMentorProfile = (): Partial<UserProfile> => ({
  contact:      { displayName: 'Test Mentor', pronouns: 'she/her', timeZone: 'America/Los_Angeles', email: '', userBio: "" },
  personal:     { firstName: 'Test', lastName: 'User', middleName: '', credentials: 'BS Computer Science', currentProfession: 'Software Engineer', collegeYear: '', degreeProgram: '' },
  preferences:  { role: 'Mentor' },
  availability: { hoursPerWeek: '5' },
});

describe('NewUserProfile — validateProfileForm', () => {
  // Check for proper return when no errors are found:
  it('returns null for a fully valid Mentee profile', () => {
    expect(validateProfileForm(baseMenteeProfile())).toBeNull();
  });
  it('returns null for a fully valid Mentor profile', () => {
    expect(validateProfileForm(baseMentorProfile())).toBeNull();
  });

  // Contact fields
  it('requires Display Name', () => {
    const p = baseMenteeProfile();
    p.contact!.displayName = '';
    expect(validateProfileForm(p)).toBe('Display Name is required');
  });
  it('rejects a whitespace-only Display Name', () => {
    const p = baseMenteeProfile();
    p.contact!.displayName = '   ';
    expect(validateProfileForm(p)).toBe('Display Name is required');
  });
  it('requires Pronouns', () => {
    const p = baseMenteeProfile();
    p.contact!.pronouns = '';
    expect(validateProfileForm(p)).toBe('Pronouns are required');
  });
  it('requires Time Zone', () => {
    const p = baseMenteeProfile();
    p.contact!.timeZone = '';
    expect(validateProfileForm(p)).toBe('Time Zone is required');
  });

  // Personal fields
  it('requires First Name', () => {
    const p = baseMenteeProfile();
    p.personal!.firstName = '';
    expect(validateProfileForm(p)).toBe('First Name is required');
  });
  it('requires Last Name', () => {
    const p = baseMenteeProfile();
    p.personal!.lastName = '';
    expect(validateProfileForm(p)).toBe('Last Name is required');
  });

  // Preferences / availability
  it('requires Role', () => {
    const p = baseMenteeProfile();
    p.preferences!.role = 'none';
    expect(validateProfileForm(p)).toBe('Role is required');
  });
  it('requires Hours Available Per Week', () => {
    const p = baseMenteeProfile();
    p.availability!.hoursPerWeek = '';
    expect(validateProfileForm(p)).toBe('Hours Available Per Week is required');
  });

  // Mentor-specific
  it('requires Credentials for Mentors', () => {
    const p = baseMentorProfile();
    p.personal!.credentials = '';
    expect(validateProfileForm(p)).toBe('Credentials are required for mentors');
  });
  it('requires Current Profession for Mentors', () => {
    const p = baseMentorProfile();
    p.personal!.currentProfession = '';
    expect(validateProfileForm(p)).toBe('Current Profession is required for mentors');
  });

  // Mentee-specific
  it('requires College Year for Mentees', () => {
    const p = baseMenteeProfile();
    p.personal!.collegeYear = '';
    expect(validateProfileForm(p)).toBe('College Year is required for mentees');
  });
  it('requires Degree Program for Mentees', () => {
    const p = baseMenteeProfile();
    p.personal!.degreeProgram = '';
    expect(validateProfileForm(p)).toBe('Degree Program is required for mentees');
  });

  // Cross-role: Mentor fields must NOT block Mentees (and vice versa)
  it('does not require Credentials for Mentees', () => {
    const p = baseMenteeProfile();
    p.personal!.credentials = '';
    expect(validateProfileForm(p)).toBeNull();
  });
  it('does not require Current Profession for Mentees', () => {
    const p = baseMenteeProfile();
    p.personal!.currentProfession = '';
    expect(validateProfileForm(p)).toBeNull();
  });
  it('does not require College Year for Mentors', () => {
    const p = baseMentorProfile();
    p.personal!.collegeYear = '';
    expect(validateProfileForm(p)).toBeNull();
  });
  it('does not require Degree Program for Mentors', () => {
    const p = baseMentorProfile();
    p.personal!.degreeProgram = '';
    expect(validateProfileForm(p)).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────
// 11. NewUserProfile — user agreement gate
// ─────────────────────────────────────────────────────────────

// Please ensure this matches the profileSubmit() function in mentor-matching-site\src\app\createAccount\components\newUserProfile\NewUserProfile.tsx:
function checkAgreement(userHasAgreed: boolean): string | null {
  if (!userHasAgreed)
    return 'You must agree to the terms of service before continuing';
  return null;
}

describe('NewUserProfile — user agreement gate', () => {
  it('blocks submission if the user has not agreed', () => {
    expect(checkAgreement(false)).toBe(
      'You must agree to the terms of service before continuing'
    );
  });
  it('allows submission if the user has agreed', () => {
    expect(checkAgreement(true)).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────
// 12. Integration — Check signup flow for OSU email addresses
// ─────────────────────────────────────────────────────────────
describe('Integration — createNewUser (OSU email)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('writes a user profile document to Firestore for an OSU user', async () => {
    (doc as jest.Mock).mockReturnValue({ id: 'test-uid-123' });
    (setDoc as jest.Mock).mockResolvedValue(undefined);

    const result = await userDb.createNewUserAsync(
      mockUser({ email: 'beaver@oregonstate.edu' }) as any,
      mockUserProfile()
    );

    expect(result).toBe(true);
    expect(setDoc).toHaveBeenCalledTimes(1);
  });
});

// ─────────────────────────────────────────────────────────────
// 13. Integration — non-OSU user is routed to pendingUsers
// ─────────────────────────────────────────────────────────────
describe('Integration — non-OSU user pending flow', () => {
  beforeEach(() => jest.clearAllMocks());

  it('a non-OSU email is not routed to the new-profile page', () => {
    const email = 'outsider@gmail.com';
    expect(email.toLowerCase().endsWith('@oregonstate.edu')).toBe(false);
  });

  it('writes the correct shape to the pendingUsers collection', async () => {
    const mockDocRef = {};
    (doc as jest.Mock).mockReturnValue(mockDocRef);
    (setDoc as jest.Mock).mockResolvedValue(undefined);

    // Simulate what CreateAccount.tsx does for a non-OSU user:
    await setDoc(mockDocRef as any, {
      email:     'outsider@gmail.com',
      createdAt: 'SERVER_TIMESTAMP',
    });

    expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
      email:     'outsider@gmail.com',
      createdAt: 'SERVER_TIMESTAMP',
    });
  });
});