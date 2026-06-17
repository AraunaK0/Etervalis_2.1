import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

export default function EmergencyScreen({ navigation }) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (user?.genero !== 'F') {
      Alert.alert(
        'Acesso restrito',
        'Esta área é exclusiva para mulheres.',
        [{ text: 'Voltar', onPress: () => navigation.goBack() }]
      );
    }
    getLocation();
  }, []);

  const getLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da sua localização para enviar ajuda.');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const [address] = await Location.reverseGeocodeAsync({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });

      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
        address: `${address?.street || ''}, ${address?.city || ''}, ${address?.region || ''}`,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização');
    } finally {
      setLocationLoading(false);
    }
  };

  const sendEmergency = async () => {
    if (!message.trim()) {
      Alert.alert('Atenção', 'Descreva sua situação antes de enviar');
      return;
    }

    if (!location) {
      Alert.alert('Localização', 'Aguarde a localização ser obtida');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('registrar_alerta', {
        p_mensagem: message.trim(),
        p_latitude: location.latitude,
        p_longitude: location.longitude,
        p_endereco: location.address,
      });

      if (error) throw error;

      if (data.success) {
        Alert.alert(
          'Socorro Acionado!',
          'A Central 180 foi notificada. Permaneça no local e aguarde ajuda.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Erro', data.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível enviar o alerta. Ligue 190 ou 180 imediatamente.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.genero !== 'F') {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🆘 Emergência</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sua Localização</Text>
        {locationLoading ? (
          <ActivityIndicator color="#fff" />
        ) : location ? (
          <>
            <Text style={styles.locationText}>{location.address}</Text>
            <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
              <Text style={styles.refreshButtonText}>Atualizar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={getLocation} style={styles.getLocationButton}>
            <Text style={styles.getLocationButtonText}>Obter Localização</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Descreva sua situação</Text>
        <TextInput
          style={styles.messageInput}
          multiline
          numberOfLines={5}
          placeholder="Ex: estou sofrendo violência, preciso de ajuda..."
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={message}
          onChangeText={setMessage}
        />
      </View>

      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={sendEmergency}
        disabled={loading}
      >
        <Text style={styles.emergencyButtonText}>
          {loading ? 'Enviando...' : '🆘 PEDIR AJUDA AGORA'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.discreetButton}
        onPress={() => {
          Alert.alert(
            'Alerta Silencioso',
            'Seu alerta será enviado sem fazer barulho no celular.',
            [{ text: 'Cancelar' }, { text: 'Enviar', onPress: sendEmergency }]
          );
        }}
      >
        <Text style={styles.discreetButtonText}>⚡ Alerta Silencioso</Text>
      </TouchableOpacity>

      <View style={styles.helpInfo}>
        <Text style={styles.helpTitle}>📌 Como pedir ajuda:</Text>
        <Text style={styles.helpText}>1️⃣ Permita o acesso à localização</Text>
        <Text style={styles.helpText}>2️⃣ Descreva sua situação</Text>
        <Text style={styles.helpText}>3️⃣ Toque em "PEDIR AJUDA AGORA"</Text>
        <Text style={styles.helpText}>4️⃣ Seu alerta será enviado para a Central 180</Text>
        <Text style={styles.helpWarning}>⚠️ Sua localização será compartilhada apenas neste momento</Text>
      </View>
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
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginRight: 40,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  refreshButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
  },
  getLocationButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  getLocationButtonText: {
    color: '#fff',
  },
  messageInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 12,
    color: '#fff',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  emergencyButton: {
    backgroundColor: '#ff4444',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  discreetButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 30,
    padding: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  discreetButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  helpInfo: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  helpTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  helpText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  helpWarning: {
    color: '#ffb74d',
    fontSize: 11,
    marginTop: 8,
  },
});