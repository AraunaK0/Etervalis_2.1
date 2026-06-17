import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { usePoints } from '../contexts/PointsContext';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = width - 40;

// Implementação simplificada com SVG (para não usar canvas nativo)
// Em produção, use react-native-svg ou react-native-skia
export default function DrawingScreen({ navigation }) {
  const { addPoints } = usePoints();
  const [saved, setSaved] = useState(false);
  const [color, setColor] = useState('#2e7d32');
  const [brushSize, setBrushSize] = useState(5);

  const handleSave = async () => {
    // Simula salvamento
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para salvar seu desenho.');
      return;
    }

    // Na implementação real, você usaria um canvas para renderizar
    // Aqui apenas simulamos pontos
    await addPoints('desenho', 10, { action: 'salvou_desenho' });
    setSaved(true);
    Alert.alert('Sucesso', 'Desenho salvo! +10 pontos');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎨 Desenho</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>⭐ 0</Text>
        </View>
      </View>

      <View style={styles.canvasPlaceholder}>
        <Text style={styles.canvasText}>
          Área de desenho{'\n'}
          (Toque para desenhar)
        </Text>
      </View>

      <View style={styles.tools}>
        <TouchableOpacity style={styles.toolButton} onPress={() => setColor('#2e7d32')}>
          <View style={[styles.colorDot, { backgroundColor: '#2e7d32' }]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={() => setColor('#e53935')}>
          <View style={[styles.colorDot, { backgroundColor: '#e53935' }]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={() => setColor('#1e88e5')}>
          <View style={[styles.colorDot, { backgroundColor: '#1e88e5' }]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={() => setColor('#fdd835')}>
          <View style={[styles.colorDot, { backgroundColor: '#fdd835' }]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={() => setColor('#000000')}>
          <View style={[styles.colorDot, { backgroundColor: '#000000' }]} />
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearText}>🧽 Limpar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>💾 Salvar</Text>
        </TouchableOpacity>
      </View>

      {saved && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>✅ Desenho salvo! +10 pontos</Text>
        </View>
      )}
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
    marginBottom: 20,
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
  canvasPlaceholder: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  canvasText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
  },
  tools: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  toolButton: {
    padding: 8,
  },
  colorDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  clearButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 30,
    padding: 14,
    paddingHorizontal: 30,
  },
  clearText: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 14,
    paddingHorizontal: 30,
  },
  saveText: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  successText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});