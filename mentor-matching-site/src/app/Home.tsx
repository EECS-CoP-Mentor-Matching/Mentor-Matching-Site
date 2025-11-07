import LoadingMessage from "./common/forms/modals/LoadingMessage";

function Home(username:any) {
  return (
    <div className="Home">
      <h3>Welcome to MentorMatch</h3>
      <p>The guidance you need, just a click away!</p>
      <h3>Hello {username.name}</h3>
    </div>
  );
}

export default Home;