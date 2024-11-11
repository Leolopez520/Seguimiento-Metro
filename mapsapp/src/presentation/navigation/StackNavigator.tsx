import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoadingScreen } from '../screens/loading/LoadingScreen';
import { MapScreen } from '../screens/maps/MapScreen';
import { PermissionScreen } from '../screens/permissions/PermissionScreen';
import LoginScreen from '../screens/login/LoginScreen';
import ForgotPasswordScreen from '../screens/login/ForgotPasswordScreen';
import SignupScreen from '../screens/login/SignupScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';


export type RootStackParams = {
    LoadingScreen: undefined;
    PermissionsScreen: undefined;
    MapScreen: undefined;
    LoginScreen: undefined;
    ForgotPasswordScreen: undefined;
    SignupScreen: undefined;
    UserProfileScreen: { usuario: any };
};

const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {




  return (
    <Stack.Navigator 
    initialRouteName="LoadingScreen"
    //initialRouteName="PermissionsScreen"
    screenOptions={{
        headerShown: false,
        cardStyle: {
            backgroundColor: 'white',
        },
    }}>
      <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="PermissionsScreen" component={PermissionScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
    </Stack.Navigator>
  );
};