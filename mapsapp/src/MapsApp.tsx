import 'react-native-gesture-handler';
//import {enableLatestRenderer} from 'react-native-maps';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './presentation/navigation/StackNavigator';
import { View, Text } from 'react-native';
import { PermissionsChecker } from './presentation/providers/PermissionsChecker';

//enableLatestRenderer();


export const MapsApp = () => {
    return (
        <NavigationContainer>
            <PermissionsChecker>
                <StackNavigator />
            </PermissionsChecker>
         </NavigationContainer>
    );
};

