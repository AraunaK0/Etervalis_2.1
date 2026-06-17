import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { usePoints } from '../contexts/PointsContext';

const quizQuestions = [
  {
    question: "Qual destes é um animal típico da Mata Atlântica?",
    options: ["Leão", "Mico-leão-dourado", "Urso polar", "Canguru"],
    correct: 1,
  },
  {
    question: "Qual árvore é símbolo da Amazônia?",
    options: ["Pau-brasil", "Seringueira", "Ipê", "Jacarandá"],
    correct: 1,
  },
  {
    question: "O que significa 'sustentabilidade'?",
    options: [
      "Explorar recursos sem limite",
      "Usar recursos sem pensar no futuro",
      "Atender às necessidades atuais sem comprometer o futuro",
      "Proibir qualquer uso de recursos",
    ],
    correct: 2,
  },
  {
    question: "Qual destes é um bioma brasileiro?",
    options: ["Savana", "Cerrado", "Tundra", "Taiga"],
    correct: 1,
  },
  {
    question: "Qual a principal causa do desmatamento?",
    options: ["Queimadas naturais", "Expansão agrícola", "Turismo", "Enchentes"],
    correct: 1,
  },
];

export default function QuizScreen({ navigation }) {
  const { addPoints } = usePoints();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswer = async (selectedIndex) => {
    if (answered) return;

    setAnswered(true);
    setSelectedAnswer(selectedIndex);

    const isCorrect = selectedIndex === quizQuestions[currentQuestion].correct;

    if (isCorrect) {
      setScore(score + 1);
      await addPoints('quiz', 5, { question: currentQuestion + 1 });
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
      const finalScore = score + (selectedAnswer === quizQuestions[currentQuestion].correct ? 1 : 0);
      if (finalScore === quizQuestions.length) {
        addPoints('quiz', 10, { bonus: 'completou_todas' });
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setQuizFinished(false);
  };

  const getOptionStyle = (index) => {
    if (!answered) return styles.option;
    if (index === quizQuestions[currentQuestion].correct) {
      return [styles.option, styles.correctOption];
    }
    if (index === selectedAnswer && index !== quizQuestions[currentQuestion].correct) {
      return [styles.option, styles.wrongOption];
    }
    return styles.option;
  };

  if (quizFinished) {
    const totalQuestions = quizQuestions.length;
    const finalScore = score + (selectedAnswer === quizQuestions[currentQuestion].correct ? 1 : 0);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🏆 Quiz Concluído!</Text>
        </View>
        <View style={styles.resultCard}>
          <Text style={styles.resultEmoji}>🎉</Text>
          <Text style={styles.resultText}>
            Você acertou {finalScore} de {totalQuestions} perguntas!
          </Text>
          <Text style={styles.resultPoints}>
            +{finalScore * 5} pontos
            {finalScore === totalQuestions && ' +10 bônus!'}
          </Text>
          <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
            <Text style={styles.restartButtonText}>🔄 Jogar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const q = quizQuestions[currentQuestion];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>❓ Quiz</Text>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>⭐ {score}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Pergunta {currentQuestion + 1} de {quizQuestions.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{q.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {q.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(index)}
            onPress={() => handleAnswer(index)}
            disabled={answered}
          >
            <Text style={styles.optionText}>
              {String.fromCharCode(65 + index)}. {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {answered && (
        <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
          <Text style={styles.nextButtonText}>
            {currentQuestion + 1 === quizQuestions.length ? 'Ver resultado' : 'Próxima pergunta →'}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
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
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    color: '#fff',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffd700',
    borderRadius: 4,
  },
  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  questionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  correctOption: {
    backgroundColor: '#4caf50',
    borderColor: '#fff',
  },
  wrongOption: {
    backgroundColor: '#f44336',
    borderColor: '#fff',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#ffd700',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  nextButtonText: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 30,
    padding: 32,
    alignItems: 'center',
    marginTop: 50,
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  resultPoints: {
    color: '#ffd700',
    fontSize: 18,
    marginBottom: 24,
  },
  restartButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 14,
    paddingHorizontal: 24,
  },
  restartButtonText: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
});