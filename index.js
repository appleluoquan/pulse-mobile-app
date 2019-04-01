/** @format */
import { AppRegistry } from "react-native";
//import AppContainer from "./country-build/app/AppContainer"; // SG build
import { name as appName } from "./app.json";
import PulseAppContainer from "./PulseAppContainer";

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => PulseAppContainer);
