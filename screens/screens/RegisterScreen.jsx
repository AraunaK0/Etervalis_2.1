import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from '../components/PasswordInput';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    celular: '',
    cpf: '',
    dataNasc: '',
    senha: '',
    confirmSenha: '',
    genero: 'F',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    const { nome, email, celular, senha, confirmSenha, genero, cpf, dataNasc } = form;

    if (!nome || !email || !celular || !senha) {
      Alert.alert('Erro', 'Preencha nome, e-mail, celular e senha');
      return;
    }
    if (senha !== confirmSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (!['F', 'M'].includes(genero)) {
      Alert.alert('Erro', 'Selecione um gênero válido');
      return;
    }

    setLoading(true);
    try {
      await register(email, senha, {
        nome,
        celular,
        genero,
        cpf: cpf || null,
        dataNasc: dataNasc || null,
      });
      Alert.alert('Sucesso', 'Conta criada! Faça login.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Criar Conta</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={form.nome}
          onChangeText={(text) => setForm({ ...form, nome: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Celular (com DDD)"
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={form.celular}
          onChangeText={(text) => setForm({ ...form, celular: text })}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="CPF (opcional)"
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={form.cpf}
          onChangeText={(text) => setForm({ ...form, cpf: text })}
          keyboardType="number-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Data de nascimento (YYYY-MM-DD)"
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={form.dataNasc}
          onChangeText={(text) => setForm({ ...form, dataNasc: text })}
        />

        <View style={styles.genderRow}>
          <Text style={styles.genderLabel}>Gênero:</Text>
          <TouchableOpacity
            style={[styles.genderOption, form.genero === 'F' && styles.genderSelected]}
            onPress={() => setForm({ ...form, genero: 'F' })}
          >
            <Text style={styles.genderText}>Feminino</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderOption, form.genero === 'M' && styles.genderSelected]}
            onPress={() => setForm({ ...form, genero: 'M' })}
          >
            <Text style={styles.genderText}>Masculino</Text>
          </TouchableOpacity>
        </View>

        <PasswordInput
          value={form.senha}
          onChangeText={(text) => setForm({ ...form, senha: text })}
          placeholder="Senha (mínimo 6 caracteres)"
        />
        <PasswordInput
          value={form.confirmSenha}
          onChangeText={(text) => setForm({ ...form, confirmSenha: text })}
          placeholder="Confirmar senha"
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#2e7d32" />
          ) : (
            <Text style={styles.registerButtonText}>🌿 Criar conta</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e7d32',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 30,
    padding: 24,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    padding: 16,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  genderLabel: {
    color: '#fff',
    marginRight: 12,
    fontSize: 16,
  },
  genderOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
  },
  genderSelected: {
    backgroundColor: '#fff',
  },
  genderText: {
    color: '#fff',
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: 'bold',
  },
});