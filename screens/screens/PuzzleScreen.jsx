import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { usePoints } from '../contexts/PointsContext';

const EMOJIS = ['🌲', '🐿️', '🦉', '🍄', '🌸', '🐝', '🍃', '🦌', '🌟'];

export default function PuzzleScreen({ navigation }) {
  const { addPoints } = usePoints();
  const [pieces, setPieces] = useState([...EMOJIS]);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [completed, setCompleted] = useState(false);

  const shufflePieces = () => {
    const shuffled = [...EMOJIS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setPieces(shuffled);
    setBoard(Array(9).fill(null));
    setCompleted(false);
  };

  const movePieceToBoard = (pieceIndex) => {
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = pieces[pieceIndex];
        const newPieces = [...pieces];
        newPieces[pieceIndex] = null;
        setBoard(newBoard);
        setPieces(newPieces);

        // Verifica se completou
        if (newBoard.every((cell) => cell !== null)) {
          setCompleted(true);
          addPoints('quebra_cabeca', 10, { action: 'completou' });
        }
        return;
      }
    }
  };

  const moveBoardToPiece = (boardIndex) => {
    if (board[boardIndex] === null) return;
    for (let i = 0; i < pieces.length; i++) {
      if (pieces[i] === null) {
        const newPieces = [...pieces];
        newPieces[i] = board[boardIndex];
        const newBoard = [...board];
        newBoard[boardIndex] = null;
        setPieces(newPieces);
        setBoard(newBoard);
        setCompleted(false);
        return;
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🧩 Quebra-cabeça</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>⭐ 0</Text>
        </View>
      </View>

      <Text style={styles.status}>
        {completed ? '🎉 Completou! +10 pontos' : 'Monte o quebra-cabeça'}
      </Text>

      <View style={styles.gameArea}>
        <View style={styles.board}>
          {board.map((cell, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.cell, cell && styles.cellFilled]}
              onPress={() => moveBoardToPiece(index)}
            >
              <Text style={styles.cellText}>{cell || ''}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.piecesContainer}>
          <Text style={styles.piecesTitle}>Peças</Text>
          <View style={styles.piecesGrid}>
            {pieces.map((piece, index) =>
              piece ? (
                <TouchableOpacity
                  key={index}
                  style={styles.piece}
                  onPress={() => movePieceToBoard(index)}
                >
                  <Text style={styles.pieceText}>{piece}</Text>
                </TouchableOpacity>
              ) : (
                <View key={index} style={styles.pieceEmpty} />
              )
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.shuffleButton} onPress={shufflePieces}>
        <Text style={styles.shuffleText}>🔀 Embaralhar</Text>
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
    fontSize: 16,
    marginBottom: 20,
  },
  gameArea: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  board: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  cell: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cellFilled: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: '#ffd700',
  },
  cellText: {
    fontSize: 30,
    color: '#fff',
  },
  piecesContainer: {
    width: '48%',
  },
  piecesTitle: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  piecesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  piece: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  pieceText: {
    fontSize: 30,
    color: '#fff',
  },
  pieceEmpty: {
    width: '30%',
    aspectRatio: 1,
    margin: 4,
  },
  shuffleButton: {
    backgroundColor: '#ffd700',
    borderRadius: 30,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  shuffleText: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
