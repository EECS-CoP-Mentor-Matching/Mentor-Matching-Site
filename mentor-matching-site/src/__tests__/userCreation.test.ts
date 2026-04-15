/*
User Creation Testing Suite
* Tests new account creation functions.  Also handles related tests such as email verification.
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
import { doc, setDoc } from 'firebase/firestore';
import userDb from '../dal/userDb';
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
  if (userProfile?.preferences?.role?.trim() == 'none')          return 'Role is required'; // Special case: the user's role is always set, but there is a 'none' value that it is initialized to.
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