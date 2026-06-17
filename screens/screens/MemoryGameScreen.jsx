import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { usePoints } from '../contexts/PointsContext';

const EMOJIS = ['🌲', '🐿️', '🦉', '🍄', '🌸', '🐝', '🍃', '🦌'];

export default function MemoryGameScreen({ navigation }) {
  const { addPoints } = usePoints();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const deck = [...EMOJIS, ...EMOJIS];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setLock(false);
    setMoves(0);
  };

  const handleCardPress = (index) => {
    if (lock) return;
    if (flipped.includes(index)) return;
    if (matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLock(true);
      setMoves(moves + 1);

      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        setLock(false);

        // Verifica se completou
        if (matched.length + 2 === cards.length) {
          addPoints('memoria', 10, { moves: moves + 1 });
          Alert.alert('Parabéns!', 'Você completou o jogo! +10 pontos');
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 1000);
      }
    }
  };

  const getCardStyle = (index) => {
    if (matched.includes(index)) return [styles.card, styles.matched];
    if (flipped.includes(index)) return [styles.card, styles.flipped];
    return styles.card;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🧠 Memória</Text>
        <View style={styles.stats}>
          <Text style={styles.statsText}>⭐ {matched.length / 2}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>Movimentos: {moves}</Text>
        <Text style={styles.infoText}>Pares: {matched.length / 2} / {EMOJIS.length}</Text>
      </View>

      <View style={styles.grid}>
        {cards.map((emoji, index) => (
          <TouchableOpacity
            key={index}
            style={getCardStyle(index)}
            onPress={() => handleCardPress(index)}
            disabled={flipped.includes(index) || matched.includes(index)}
          >
            <Text style={styles.cardText}>
              {flipped.includes(index) || matched.includes(index) ? emoji : '?'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={initGame}>
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
  stats: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statsText: {
    color: '#ffd700',
    fontWeight: 'bold',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  card: {
    width: '20%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  flipped: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: '#ffd700',
  },
  matched: {
    backgroundColor: '#4caf50',
    borderColor: '#fff',
  },
  cardText: {
    fontSize: 28,
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