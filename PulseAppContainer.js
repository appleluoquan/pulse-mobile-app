import React, { PureComponent } from "react";
import LoginStack from "./app/containers/index";
import SideBar from "./app/containers/MainPage/SideBar";
import {
  AppContainer,
  CoreServices,
} from "@pru-rt-internal/rnmobile-app-core-framework"; //This should be used for ML build


const { NavigationService } = CoreServices;

export default class PulseAppContainer extends PureComponent {
  render() {
    return (
      <AppContainer drawerView={SideBar}>
        <LoginStack ref={navigatorRef => {NavigationService.setTopLevelNavigator(navigatorRef)}} />
      </AppContainer>
    );
  }
}
