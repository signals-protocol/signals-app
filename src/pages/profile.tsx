import Header from "../components/layout/Header";
import Body from "../components/layout/Body";
import Profile from "components/features/profile";

export default function ProfilePage() {
  return (
    <div>
      <Header />
      <Body>
        <Profile />
      </Body>
    </div>
  );
}
