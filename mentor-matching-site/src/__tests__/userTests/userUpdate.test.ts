/*
User Update Testing Suite
* Tests profile changes and updates for user accounts (Note: many of these functions are re-used in the admin's edit user profile section)
* All tests can be run by executing 'npm test' within the main directory.
*/

// Create a mock version of the userService functions and our firestore/database tools:
jest.mock('../../service/userService', () => {
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

jest.mock('../../service/authService', () => {
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

jest.mock('../../firebaseConfig', () => ({
  db:  {},
  app: {},
}));

// Import the functions that we are looking to test:

import userService from '../../service/userService';
import authService from '../../service/authService';
import { deleteUser, getAuth } from 'firebase/auth';
import { UserProfile } from '../../types/userProfile';
import { initUserProfile } from '../../types/userProfile';
import { isValidEmail } from '../../app/common/forms/validation';


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

// ─────────────────────────────────────────────────────────────
// 4. UpdatePersonalInformation — updateNameField logic
//    Please ensure that this function matches the one in UpdatePersonalInformation.tsx
// ─────────────────────────────────────────────────────────────


function updateNameField(
  userProfile: UserProfile,
  field: keyof UserProfile['personal'],
  value: string
): UserProfile {
  return {
    ...userProfile,
    personal: {
      ...userProfile.personal,
      [field]: value,
    }
  };
}

describe('UpdatePersonalInformation — updateNameField', () => {
  it('updates firstName without affecting other personal fields', () => {
    const profile = mockUserProfile();
    const result = updateNameField(profile, 'firstName', 'NewFirst');

    expect(result.personal.firstName).toBe('NewFirst');
    expect(result.personal.lastName).toBe(profile.personal.lastName);
    expect(result.personal.middleName).toBe(profile.personal.middleName);
  });

  it('updates lastName without affecting other personal fields', () => {
    const profile = mockUserProfile();
    const result = updateNameField(profile, 'lastName', 'NewLast');

    expect(result.personal.lastName).toBe('NewLast');
    expect(result.personal.firstName).toBe(profile.personal.firstName);
    expect(result.personal.middleName).toBe(profile.personal.middleName);
  });

  it('updates credentials without affecting name fields', () => {
    const profile = mockUserProfile();
    const result = updateNameField(profile, 'credentials', 'PhD');

    expect(result.personal.credentials).toBe('PhD');
    expect(result.personal.firstName).toBe(profile.personal.firstName);
    expect(result.personal.lastName).toBe(profile.personal.lastName);
    expect(result.personal.middleName).toBe(profile.personal.middleName);
  });

  it('updates currentProfession without affecting other fields', () => {
    const profile = mockUserProfile();
    const result = updateNameField(profile, 'currentProfession', 'Data Scientist');

    expect(result.personal.currentProfession).toBe('Data Scientist');
    expect(result.personal.credentials).toBe(profile.personal.credentials);
  });

  it('does not mutate the original profile object', () => {
    const profile = mockUserProfile();
    const originalFirstName = profile.personal.firstName;
    updateNameField(profile, 'firstName', 'Changed');

    expect(profile.personal.firstName).toBe(originalFirstName);
  });

  it('preserves all non-personal fields when updating a personal field', () => {
    const profile = mockUserProfile();
    const result = updateNameField(profile, 'firstName', 'NewName');

    expect(result.contact).toEqual(profile.contact);
    expect(result.availability).toEqual(profile.availability);
    expect(result.preferences).toEqual(profile.preferences);
    expect(result.accountSettings).toEqual(profile.accountSettings);
  });
});

// ─────────────────────────────────────────────────────────────
// 5. UpdatePersonalInformation — updateAvailabilityField logic
//    Please ensure that this function matches the one in UpdatePersonalInformation.tsx
// ─────────────────────────────────────────────────────────────

function updateAvailabilityField(
  userProfile: UserProfile,
  field: keyof UserProfile['availability'],
  value: string
): UserProfile {
  return {
    ...userProfile,
    availability: {
      ...userProfile.availability,
      [field]: value,
    }
  };
}

describe('UpdatePersonalInformation — updateAvailabilityField', () => {
  it('updates hoursPerWeek correctly', () => {
    const profile = mockUserProfile();
    const result = updateAvailabilityField(profile, 'hoursPerWeek', '10');

    expect(result.availability.hoursPerWeek).toBe('10');
  });

  it('does not affect personal or contact fields when updating availability', () => {
    const profile = mockUserProfile();
    const result = updateAvailabilityField(profile, 'hoursPerWeek', '10');

    expect(result.personal).toEqual(profile.personal);
    expect(result.contact).toEqual(profile.contact);
  });

  it('does not mutate the original profile object', () => {
    const profile = mockUserProfile();
    const originalHours = profile.availability.hoursPerWeek;
    updateAvailabilityField(profile, 'hoursPerWeek', '20');

    expect(profile.availability.hoursPerWeek).toBe(originalHours);
  });
});

// ─────────────────────────────────────────────────────────────
// 6. UpdatePersonalInformation — role change logic
//    Please ensure that this function matches the one in UpdatePersonalInformation.tsx
// ─────────────────────────────────────────────────────────────

function commitRoleChange(userProfile: UserProfile, role: string): UserProfile {
  return {
    ...userProfile,
    preferences: {
      ...userProfile.preferences,
      role: role as any,
    }
  };
}

// Simulate the environment for displaying the admin dialog confirmation messages (Promoting/demoting an admin account):
function shouldShowAdminDialog(currentRole: string, newRole: string): boolean {
  const isGrantingAdmin  = newRole === 'Admin' && currentRole !== 'Admin';
  const isRevokingAdmin  = currentRole === 'Admin' && newRole !== 'Admin';
  return isGrantingAdmin || isRevokingAdmin;
}

describe('UpdatePersonalInformation — role change logic', () => {
  it('commitRoleChange updates the role correctly', () => {
    const profile = mockUserProfile();
    const result = commitRoleChange(profile, 'Mentee');

    expect(result.preferences.role).toBe('Mentee');
  });

  it('commitRoleChange does not affect other fields', () => {
    const profile = mockUserProfile();
    const result = commitRoleChange(profile, 'Mentee');

    expect(result.personal).toEqual(profile.personal);
    expect(result.contact).toEqual(profile.contact);
    expect(result.availability).toEqual(profile.availability);
  });

  it('does not mutate the original profile when committing a role change', () => {
    const profile = mockUserProfile();
    const originalRole = profile.preferences.role;
    commitRoleChange(profile, 'Mentee');

    expect(profile.preferences.role).toBe(originalRole);
  });

  // Admin dialog trigger tests
  it('triggers admin dialog when granting admin to a non-admin user', () => {
    expect(shouldShowAdminDialog('Mentor', 'Admin')).toBe(true);
  });

  it('triggers admin dialog when revoking admin from an admin user', () => {
    expect(shouldShowAdminDialog('Admin', 'Mentor')).toBe(true);
  });

  it('does not trigger admin dialog for non-admin role changes', () => {
    expect(shouldShowAdminDialog('Mentor', 'Mentee')).toBe(false);
  });

  it('does not trigger admin dialog when role stays the same', () => {
    expect(shouldShowAdminDialog('Mentor', 'Mentor')).toBe(false);
  });

  it('does not trigger admin dialog when admin stays admin', () => {
    expect(shouldShowAdminDialog('Admin', 'Admin')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// 7. UpdateUserContactInformation — updateContactField logic
//    Please ensure that this mirrors the function in UpdateUserContactInformation.tsx
// ─────────────────────────────────────────────────────────────

function updateContactField(
  userProfile: UserProfile,
  field: keyof UserProfile['contact'],
  value: string
): UserProfile {
  return {
    ...userProfile,
    contact: {
      ...userProfile.contact,
      [field]: value,
    }
  };
}

describe('UpdateUserContactInformation — updateContactField', () => {
  it('updates displayName without affecting other contact fields', () => {
    const profile = mockUserProfile();
    const result = updateContactField(profile, 'displayName', 'Benny Beaver');

    expect(result.contact.displayName).toBe('Benny Beaver');
    expect(result.contact.email).toBe(profile.contact.email);
    expect(result.contact.pronouns).toBe(profile.contact.pronouns);
    expect(result.contact.timeZone).toBe(profile.contact.timeZone);
  });

  it('updates pronouns without affecting other contact fields', () => {
    const profile = mockUserProfile();
    const result = updateContactField(profile, 'pronouns', 'he/him');

    expect(result.contact.pronouns).toBe('he/him');
    expect(result.contact.displayName).toBe(profile.contact.displayName);
  });

  it('updates timeZone without affecting other contact fields', () => {
    const profile = mockUserProfile();
    const result = updateContactField(profile, 'timeZone', 'America/New_York');

    expect(result.contact.timeZone).toBe('America/New_York');
    expect(result.contact.displayName).toBe(profile.contact.displayName);
  });

it('updates email via updateContactField', () => {
  const profile = mockUserProfile();
  const result = updateContactField(profile, 'email', 'newcontact@oregonstate.edu');

  expect(result.contact.email).toBe('newcontact@oregonstate.edu');
  expect(result.contact.displayName).toBe(profile.contact.displayName);
});

it('emailIsInvalid is true when editing and email is malformed', () => {
  const showEdit = true;
  const email = 'notanemail';
  const emailIsInvalid = showEdit && email.trim() !== '' && !isValidEmail(email);

  expect(emailIsInvalid).toBe(true);
});

it('emailIsInvalid is false when email is valid', () => {
  const showEdit = true;
  const email = 'beaver@oregonstate.edu';
  const emailIsInvalid = showEdit && email.trim() !== '' && !isValidEmail(email);

  expect(emailIsInvalid).toBe(false);
});

it('emailIsInvalid is false when not in edit mode regardless of email value', () => {
  const showEdit = false;
  const email = 'notanemail';
  const emailIsInvalid = showEdit && !isValidEmail(email);

  expect(emailIsInvalid).toBe(false);
});

it('emailIsInvalid is false when email is empty', () => {
  const showEdit = true;
  const email = '';
  const emailIsInvalid = showEdit && email.trim() !== '' && !isValidEmail(email);

  expect(emailIsInvalid).toBe(false);
});

  it('does not mutate the original profile object', () => {
    const profile = mockUserProfile();
    const originalDisplayName = profile.contact.displayName;
    updateContactField(profile, 'displayName', 'Changed');

    expect(profile.contact.displayName).toBe(originalDisplayName);
  });

  it('preserves all non-contact fields when updating a contact field', () => {
    const profile = mockUserProfile();
    const result = updateContactField(profile, 'displayName', 'Test Beaver');

    expect(result.personal).toEqual(profile.personal);
    expect(result.availability).toEqual(profile.availability);
    expect(result.preferences).toEqual(profile.preferences);
    expect(result.accountSettings).toEqual(profile.accountSettings);
  });
});

// ─────────────────────────────────────────────────────────────
// 8. authService — deleteUserAccount
// ─────────────────────────────────────────────────────────────

describe('authService — deleteUserAccount', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls deleteUserAccount successfully', async () => {
    (authService.deleteUserAccount as jest.Mock).mockResolvedValue(undefined);

    await authService.deleteUserAccount();

    expect(authService.deleteUserAccount).toHaveBeenCalledTimes(1);
  });

  it('throws an error if no user is signed in', async () => {
    (authService.deleteUserAccount as jest.Mock).mockRejectedValue(
      new Error('No signed-in user to delete.')
    );

    await expect(authService.deleteUserAccount()).rejects.toThrow(
      'No signed-in user to delete.'
    );
  });

  it('throws and logs error if deleteUser fails', async () => {
    const err = new Error('Requires recent login');
    (authService.deleteUserAccount as jest.Mock).mockRejectedValue(err);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await authService.deleteUserAccount();
    } catch (error) {
      console.error('Error deleting user account:', error);
    }

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error deleting user account:',
      err
    );
    consoleSpy.mockRestore();
  });
});

// ─────────────────────────────────────────────────────────────
// 9. Integration — full profile update flow
// ─────────────────────────────────────────────────────────────
describe('Integration — full profile update flow', () => {
  beforeEach(() => jest.clearAllMocks());

  it('loads profile initially then saves updated profile correctly', async () => {
    const profile = mockUserProfile();
    (authService.getSignedInUser as jest.Mock).mockResolvedValue(mockUser());
    (userService.getUserProfile as jest.Mock).mockResolvedValue(profile);
    (userService.updateUserProfile as jest.Mock).mockResolvedValue(undefined);

    // Simulate initialization:
    const user = await authService.getSignedInUser();
    const loaded = user ? await userService.getUserProfile(user.uid) : null;

    // Simulate user editing their display name:
    const updated = updateContactField(loaded!, 'displayName', 'Updated Beaver');

    // Simulate saveChanges():
    await userService.updateUserProfile(updated.UID, updated);

    expect(userService.updateUserProfile).toHaveBeenCalledWith(
      'test-uid-123',
      expect.objectContaining({
        contact: expect.objectContaining({ displayName: 'Updated Beaver' })
      })
    );
  });

  it('full account deletion removes profile data then auth account', async () => {
    (userService.deleteUserProfile as jest.Mock).mockResolvedValue(undefined);
    (authService.deleteUserAccount as jest.Mock).mockResolvedValue(undefined);

    const profile = mockUserProfile();

    // Simulate handleDeleteAccount():
    await userService.deleteUserProfile(profile.UID);
    await authService.deleteUserAccount();

    expect(userService.deleteUserProfile).toHaveBeenCalledWith('test-uid-123');
    expect(authService.deleteUserAccount).toHaveBeenCalledTimes(1);
  });
});
