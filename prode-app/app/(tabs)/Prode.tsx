import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Button, Alert, TouchableOpacity } from 'react-native';
import partidosData from '@/assets/jsons-test/fecha_23.json';
import svgMap from '@/assets/svgMap';

// Define el tipo de `predictions` como un objeto donde las claves son números y los valores son cadenas
type PredictionsType = {
  [key: number]: 'local' | 'empate' | 'visitante';
};

export default function Prode() {
  // Estados para los pronósticos y si son editables
  const [predictions, setPredictions] = useState<PredictionsType>({});
  const [isEditable, setIsEditable] = useState(true);

  const handlePrediction = (matchId: number, prediction: 'local' | 'empate' | 'visitante') => {
    // Solo permite modificar si `isEditable` es true
    if (isEditable) {
      setPredictions(prev => ({
        ...prev,
        [matchId]: prediction,
      }));
    }
  };

  const handleSave = () => {
    const allPredicted = partidosData.every((_, index) => predictions[index] !== undefined);

    if (!allPredicted) {
      Alert.alert('Error', 'Completa el pronóstico de todos los partidos.');
    } else {
      Alert.alert('Éxito', 'Los pronósticos se han guardado correctamente.');
      setIsEditable(false);
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PRODE</Text>
      <ScrollView style={styles.scrollView}>
        {partidosData.map((item, index) => {
          const TeamLogo1 = svgMap[item["Imagen1"] as keyof typeof svgMap];
          const TeamLogo2 = svgMap[item["Imagen2"] as keyof typeof svgMap];

          return (
            <View key={index} style={styles.matchContainer}>
              <View style={styles.teamsContainer}>
                <View style={styles.team1}>
                  {TeamLogo1 && <TeamLogo1 width={40} height={40} />}
                  <Text>{item["Equipo1"]}</Text>
                </View>
                <Text style={styles.vsText}>vs</Text>
                <View style={styles.team2}>
                  {TeamLogo2 && <TeamLogo2 width={40} height={40} />}
                  <Text>{item["Equipo2"]}</Text>
                </View>
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    predictions[index] === 'local' && styles.buttonSelected,
                    !isEditable && styles.buttonDisabled,
                  ]}
                  onPress={() => handlePrediction(index, 'local')}
                  disabled={!isEditable}
                >
                  <Text>Local</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    predictions[index] === 'empate' && styles.buttonSelected,
                    !isEditable && styles.buttonDisabled,
                  ]}
                  onPress={() => handlePrediction(index, 'empate')}
                  disabled={!isEditable}
                >
                  <Text>Empate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    predictions[index] === 'visitante' && styles.buttonSelected,
                    !isEditable && styles.buttonDisabled,
                  ]}
                  onPress={() => handlePrediction(index, 'visitante')}
                  disabled={!isEditable}
                >
                  <Text>Visitante</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
        {isEditable ? (
          <Button title="Guardar" onPress={handleSave} color="#007BFF" />
        ) : (
          <Button title="Modificar" onPress={handleEdit} color="#FF5733" />
        )}
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
  team1: {
    flex: 1,
    alignItems: 'center',
  },
  team2: {
    flex: 1,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
