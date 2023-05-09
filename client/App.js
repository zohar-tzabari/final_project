import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


import Home from './Home';
import SearchObject from './SearchObject';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SearchObject" component={SearchObject} />
              </Stack.Navigator>
    </NavigationContainer>
  );
}