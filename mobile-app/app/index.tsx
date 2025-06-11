import { useAuth } from "@/utils/authContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { isLoggedIn } = useAuth();
  return <Redirect href={isLoggedIn ? "/(protected)/home" : "/login"} />;
}
