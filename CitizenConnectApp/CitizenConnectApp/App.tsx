import { registerRootComponent } from "expo";
import { Slot } from "expo-router";

// This lets expo-router handle all navigation automatically
export default function App() {
  return <Slot />;
}

registerRootComponent(App);