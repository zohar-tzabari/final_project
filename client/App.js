import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeContainer from './HomeContainer';
import SearchObject from './SearchObject';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomePresenter" component={HomeContainer} />
        <Stack.Screen name="SearchObject" component={SearchObject} />
              </Stack.Navigator>
    </NavigationContainer>
  );
}