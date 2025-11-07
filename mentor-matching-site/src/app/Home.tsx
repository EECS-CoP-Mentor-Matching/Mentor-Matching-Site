import LoadingMessage from "./common/forms/modals/LoadingMessage";
import { useAppSelector } from '../redux/hooks';


function Home() {
  const userProfile = useAppSelector((state) => state.userProfile.userProfile);
  console.log('Redux state userProfile:', userProfile);
  return (
    <div className="Home">
      <h3>Welcome to MentorMatch</h3>
      <p>The guidance you need, just a click away!</p>
      <h3>Hello {userProfile?.contact?.displayName}</h3>
    </div>
  );
}

export default Home;