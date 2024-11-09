import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Button, Alert, TouchableOpacity } from 'react-native';
import partidosData from '@/assets/jsons-test/fecha_12.json';

// Define el tipo de `predictions` como un objeto donde las claves son números y los valores son cadenas
type PredictionsType = {
  [key: number]: 'local' | 'empate' | 'visitante';
};

export default function Prode() {
  // Utiliza el tipo `PredictionsType` para el estado `predictions`
  const [predictions, setPredictions] = useState<PredictionsType>({});

  const handlePrediction = (matchId: number, prediction: 'local' | 'empate' | 'visitante') => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: prediction,
    }));
  };

  const handleSave = () => {
    const allPredicted = partidosData.every((_, index) => predictions[index] !== undefined);

    if (!allPredicted) {
      Alert.alert('Error', 'Completa el pronóstico de todos los partidos.');
    } else {
      Alert.alert('Éxito', 'Los pronósticos se han guardado correctamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PRODE</Text>
      <ScrollView style={styles.scrollView}>
        {partidosData.map((item, index) => (
          <View key={index} style={styles.matchContainer}>
            <Text style={styles.dateText}>{item["Dia"]} - {item["Tiempo"]}</Text>
            <View style={styles.teamsContainer}>
              <Text style={styles.teamText}>{item["Equipo1"]}</Text>
              <Text style={styles.vsText}>vs</Text>
              <Text style={styles.teamText}>{item["Equipo2"]}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  predictions[index] === 'local' && styles.buttonSelected,
                ]}
                onPress={() => handlePrediction(index, 'local')}
              >
                <Text>Local</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  predictions[index] === 'empate' && styles.buttonSelected,
                ]}
                onPress={() => handlePrediction(index, 'empate')}
              >
                <Text>Empate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  predictions[index] === 'visitante' && styles.buttonSelected,
                ]}
                onPress={() => handlePrediction(index, 'visitante')}
              >
                <Text>Visitante</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <Button title="Guardar" onPress={handleSave} color="#007BFF" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  scrollView: {
    flex: 1,
    marginBottom: 16,
  },
  matchContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamText: {
    fontSize: 18,
    color: '#333',
  },
  vsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  buttonSelected: {
    backgroundColor: '#007BFF',
  },
});
