import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { usePoints } from '../contexts/PointsContext';
import GameCard from '../components/GameCard';

const GAMES = [
  { id: 'quiz', title: 'Quiz da Floresta', icon: '❓', screen: 'Quiz' },
  { id: 'desenho', title: 'Desenho Criativo', icon: '🎨', screen: 'Drawing' },
  { id: 'quebra_cabeca', title: 'Quebra-cabeça', icon: '🧩', screen: 'Puzzle' },
  { id: 'memoria', title: 'Jogo da Memória', icon: '🧠', screen: 'MemoryGame' },
  { id: 'velha', title: 'Jogo da Velha', icon: '⭕', screen: 'TicTacToe' },
];

export default function MainMenuScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { points } = usePoints();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenGame = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>🌳 Olá, {user?.nome || 'Amiga'}!</Text>
          <Text style={styles.subWelcome}>
            {user?.genero === 'F'
              ? 'Você tem acesso à área de emergência'
              : 'Divirta-se com os jogos!'}
          </Text>
        </View>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>⭐ {points}</Text>
        </View>
      </View>

      {user?.genero === 'F' && (
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => navigation.navigate('Emergency')}
        >
          <Text style={styles.emergencyButtonText}>🆘 Área de Emergência</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>🌿 Escolha seu jogo</Text>

      <ScrollView contentContainerStyle={styles.gamesGrid}>
        {GAMES.map((game) => (
          <GameCard
            key={game.id}
            icon={game.icon}
            title={game.title}
            onPress={() => handleOpenGame(game.screen)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e7d32',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcome: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subWelcome: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  pointsBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pointsText: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emergencyButton: {
    backgroundColor: '#ff4444',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 30,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});