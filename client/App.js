import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


import HomeContainer from './HomeContainer';
import SearchObject from './SearchObject';
import Try from './tempTry';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomePresenter" component={Try} />
        <Stack.Screen name="SearchObject" component={SearchObject} />
              </Stack.Navigator>
    </NavigationContainer>
  );
}