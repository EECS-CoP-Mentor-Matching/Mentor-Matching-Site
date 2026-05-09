/*
User Deletion Testing Suite
* Tests the user profile and account-level deletion processes.
* All account details are to be mocked with dummy data, and no
* real accounts will be created or destroyed in these tests.
*/

// ─────────────────────────────────────────────────────────────
// Mocks
// ─────────────────────────────────────────────────────────────
 
jest.mock('../../service/userService', () => {
  const mockUserService = {
    getUserProfile:    jest.fn(),
    updateUserProfile: jest.fn(),
    deleteUserProfile: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockUserService,
    ...mockUserService,
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
    ...mockAuthService,
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

// ─────────────────────────────────────────────────────────────
// Imports
// ─────────────────────────────────────────────────────────────
 
import userService from '../../service/userService';
import authService from '../../service/authService';
import { UserProfile } from '../../types/userProfile';
import { initUserProfile } from '../../types/userProfile';

// ─────────────────────────────────────────────────────────────
// Create a test user:
// ─────────────────────────────────────────────────────────────
 
const mockUser = (overrides = {}) => ({
  uid:           'test-uid-123',
  email:         'beaverb@oregonstate.edu',
  emailVerified: true,
  reload:        jest.fn(),
  getIdToken:    jest.fn(),
  ...overrides,
});
 
const mockUserProfile = (): UserProfile => ({
  ...initUserProfile(),
  UID: 'test-uid-123',
  contact: {
    email:       'beaverb@oregonstate.edu',
    displayName: 'Benny Beaver',
    pronouns:    'they/them',
    timeZone:    'America/Los_Angeles',
    userBio:     '',
  },
  personal: {
    firstName:         'Benny',
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
// Because some of our delete functionality is intertwined with UI elements 
// (such as confirmation dialogs),  These mirror the state logic in 
// UpdateUserProfile.tsx so that we can test the UI deletion flow
// without needing to import the original component.
// ─────────────────────────────────────────────────────────────
 
function deletionUiState() {
  return {
    showDeleteButton:  false,
    openDeleteDialog:  false,
  };
}
 
function clickLookingToDelete(state: ReturnType<typeof deletionUiState>) {
  return { ...state, showDeleteButton: true };
}
 
function clickDeleteAccountButton(state: ReturnType<typeof deletionUiState>) {
  return { ...state, openDeleteDialog: true };
}
 
function clickCancelDialog(state: ReturnType<typeof deletionUiState>) {
  return { ...state, openDeleteDialog: false };
}

// ─────────────────────────────────────────────────────────────
// 1. UI Flow — Reveal the Delete Button
// ─────────────────────────────────────────────────────────────
 
describe('UI Flow — Reveal the Delete Button', () => {
  it('Delete Account button is hidden by default', () => {
    const state = deletionUiState();
    expect(state.showDeleteButton).toBe(false);
  });
 
  it('clicking "Looking to delete your account?" reveals the Delete Account button', () => {
    const state = deletionUiState();
    const next  = clickLookingToDelete(state);
    expect(next.showDeleteButton).toBe(true);
  });
 
  it('revealing the Delete Account button does not open the dialog', () => {
    const state = deletionUiState();
    const next  = clickLookingToDelete(state);
    expect(next.openDeleteDialog).toBe(false);
  });
});
