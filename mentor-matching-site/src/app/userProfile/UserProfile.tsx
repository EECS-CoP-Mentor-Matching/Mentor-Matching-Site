import { InputLabel, Input, TextareaAutosize, FormLabel } from "@mui/material";
import "./UserProfile.css";
import { useNavigate } from 'react-router-dom';


function UserProfile() {
  const email = "p.a.tasabia@gmail.com";
  const displayName = "Philip T.";
  const firstName = "Philip";
  const lastName = "Tasabia";
  const middleName = "Andrew";
  const pronouns = "he/him";
  const racialIdentity = "Hispanic";
  const timeZone = "Eastern US";
  const userBio = "Hi! My name is philip and I am a senior in the OSU Computer Science program."
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
  const navigate = useNavigate();


  

  useEffect(() => {
    const loadUserProfile = async () => {
      const currentUser = await authService.getSignedInUser();
      if (currentUser) {
        const profile = await userService.getUserProfile(currentUser.uid);
        setUserProfile(profile);
      }
    };

    loadUserProfile();
  }, []);

  if (!userProfile) {
    return <div>Loading profile...</div>;
  }
  return (
    <div className="user-profile">
      <button onClick={() => navigate('/profile/edit')}>Edit Profile</button>
    </div>
    <div className="user-profile">
      <div>
        <FormLabel>Contact Information</FormLabel>
        <div className="profile-section">
          <div className="profile-item">
            <InputLabel>Email</InputLabel>
            <Input readOnly value={email} />
          </div>
          <div className="profile-item">
            <InputLabel>Display/Contact Name</InputLabel>
            <Input readOnly value={displayName} />
          </div>
        </div>
      </div>
      <div>
        <FormLabel>Personal Information</FormLabel>
        <div className="profile-section">
          <div className="profile-item">
            <InputLabel>First Name</InputLabel>
            <Input readOnly value={firstName} />
          </div>
          <div className="profile-item">
            <InputLabel>Last Name</InputLabel>
            <Input readOnly value={lastName} />
          </div>
          <div className="profile-item">
            <InputLabel>Middle Name</InputLabel>
            <Input readOnly value={middleName} />
          </div>
        </div>
      </div>
      <FormLabel>Demographic Information</FormLabel>
      <div className="profile-section">
        <div className="profile-item">
          {/* make into a drop down */}
          <InputLabel>Pronouns</InputLabel>
          <Input readOnly value={pronouns} />
        </div>
        <div className="profile-item">
          {/* Make into a drop down */}
          <InputLabel>Racial Identity(s)</InputLabel>
          <Input readOnly value={racialIdentity} />
        </div>
        <div className="profile-item">
          {/* Make into a drop down */}
          <InputLabel>LGBTQ+</InputLabel>
          <Input readOnly />
        </div>
        <div className="profile-item">
        {/* make into a drop down */}
          <InputLabel>Time Zone</InputLabel>
          <Input readOnly value={timeZone} />
        </div>
      </div>
      <div>
        <div className="profile-section">
          <div className="profile-item">
            <InputLabel>User Bio</InputLabel>
            <TextareaAutosize style={{ width:  "450px", height: "200px" }} value={userBio} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;