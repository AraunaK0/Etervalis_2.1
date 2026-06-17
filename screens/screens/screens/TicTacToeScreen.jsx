import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { usePoints } from '../contexts/PointsContext';

export default function TicTacToeScreen({ navigation }) {
  const { addPoints } = usePoints();
  const [board, setBoard] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('❌');
  const [gameActive, setGameActive] = useState(true);
  const [pointsGiven, setPointsGiven] = useState(false);

  const checkWinner = (boardState) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a];
      }
    }
    return null;
  };

  const handlePress = (index) => {
    if (!gameActive) return;
    if (board[index] !== '') return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameActive(false);
      if (!pointsGiven) {
        addPoints('velha', 5, { winner });
        setPointsGiven(true);
        Alert.alert('Fim de jogo', `${winner} venceu! +5 pontos`);
      }
      return;
    }

    if (newBoard.every((cell) => cell !== '')) {
      setGameActive(false);
      Alert.alert('Empate!', 'Ninguém venceu.');
      return;
    }

    setCurrentPlayer(currentPlayer === '❌' ? '⭕' : '❌');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setCurrentPlayer('❌');
    setGameActive(true);
    setPointsGiven(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>⭕ Jogo da Velha</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>⭐ 0</Text>
        </View>
      </View>

      <Text style={styles.status}>
        {gameActive ? `Vez de: ${currentPlayer}` : 'Fim de jogo'}
      </Text>

      <View style={styles.board}>
        {board.map((cell, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cell}
            onPress={() => handlePress(index)}
            disabled={!gameActive}
          >
            <Text style={styles.cellText}>{cell}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetText}>🔄 Reiniciar</Text>
      </TouchableOpacity>
    </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  pointsBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    color: '#ffd700',
    fontWeight: 'bold',
  },
  status: {
    color: '#ffd700',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  board: {
    width: '100%',
    aspectRatio: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 10,
  },
  cell: {
    width: '33.33%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cellText: {
    fontSize: 48,
    color: '#fff',
  },
  resetButton: {
    backgroundColor: '#ffd700',
    borderRadius: 30,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  resetText: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: 'bold',
  },
});