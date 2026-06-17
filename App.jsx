import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { PointsProvider } from './src/contexts/PointsContext';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import MainMenuScreen from './src/screens/MainMenuScreen';
import QuizScreen from './src/screens/QuizScreen';
import DrawingScreen from './src/screens/DrawingScreen';
import PuzzleScreen from './src/screens/PuzzleScreen';
import MemoryGameScreen from './src/screens/MemoryGameScreen';
import TicTacToeScreen from './src/screens/TicTacToeScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';

const Stack = createStackNavigator();

function AppNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return <SplashScreen />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="MainMenu" component={MainMenuScreen} />
                    <Stack.Screen name="Quiz" component={QuizScreen} />
                    <Stack.Screen name="Drawing" component={DrawingScreen} />
                    <Stack.Screen name="Puzzle" component={PuzzleScreen} />
                    <Stack.Screen name="MemoryGame" component={MemoryGameScreen} />
                    <Stack.Screen name="TicTacToe" component={TicTacToeScreen} />
                    <Stack.Screen name="Emergency" component={EmergencyScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <PointsProvider>
                <NavigationContainer>
                    <AppNavigator />
                </NavigationContainer>
            </PointsProvider>
        </AuthProvider>
    );
}