import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Modal, FlatList } from 'react-native';
import Partido from './partido';
import svgMap from '@/assets/svgMap';

export default function Inicio() {
  const [shownDates, setShownDates] = useState<Set<string>>(new Set());
  const [selectedPage, setSelectedPage] = useState<"partido" | null>(null);
  const [partidosData, setPartidosData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFecha, setSelectedFecha] = useState<string>("22");
  const [modalVisible, setModalVisible] = useState(false);
  const [gameInfo, setGameInfo] = useState<string | null>(null); // Añadir un estado para almacenar la información del partido

  // Función para cargar la vista de partido
  const loadPartido = () => setSelectedPage("partido");

  // Función para hacer fetch del JSON según la fecha seleccionada
  const fetchPartidosData = async (fecha: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:3000/get_json/fecha_${fecha}.json`);
      const data = await response.json();
      setPartidosData(data);
      setShownDates(new Set());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar los datos al iniciar o cuando cambia la fecha
  useEffect(() => {
    fetchPartidosData(selectedFecha);
  }, [selectedFecha]);

  const selectFecha = (fecha: string) => {
    setSelectedFecha(fecha);
    setModalVisible(false);  // Cerrar el modal después de seleccionar una fecha
  };

  const fechas = Array.from({ length: 27 }, (_, i) => `${i + 1}`);

  const handlePartidoSelect = (gameInfo: string) => {
    setGameInfo(gameInfo); // Guardar la información del partido en el estado
    loadPartido(); // Cargar la vista del partido
  };

  return (
    <View style={[styles.container, selectedPage === "partido" && styles.containerExpanded]}>
      {selectedPage === "partido" ? (
        <Partido gameInfo={gameInfo} /> // Pasar la información del partido a la vista Partido
      ) : (
        <>
          <View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.title}>Fecha {selectedFecha}</Text>
            </TouchableOpacity>

            {/* Modal para seleccionar la fecha */}
            <Modal visible={modalVisible} animationType="slide" transparent>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={fechas}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => selectFecha(item)}>
                        <Text style={styles.fechaItem}>Fecha {item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButton}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <ScrollView
              style={styles.table_scroll}
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.allgames}>
                {partidosData.map((item, index) => {
                  const isDateShown = shownDates.has(item["Dia"]);
                  const TeamLogo1 = svgMap[item["Imagen1"] as keyof typeof svgMap];
                  const TeamLogo2 = svgMap[item["Imagen2"] as keyof typeof svgMap];
                  if (!isDateShown) {
                    shownDates.add(item["Dia"]);
                  }

                  return (
                    <View key={index}>
                      {!isDateShown && (
                        <View style={styles.date}>
                          <Text>{item["Dia"]}</Text>
                        </View>
                      )}
                      <TouchableOpacity onPress={() => handlePartidoSelect(item["Game-info"])}>
                        <View style={styles.cuadrado}>
                          <View style={styles.match}>
                            <View style={styles.team1}>
                            <View>
                            {TeamLogo1 && <TeamLogo1 width={40} height={40} />}
                            </View>
                              <Text>{item["Equipo1"]}</Text>
                            </View>
                            <View style={styles.time}>
                              <Text>{item["Tiempo"]}</Text>
                              <Text>{item["Resultado1"]} - {item["Resultado2"]}</Text>
                            </View>
                            <View style={styles.team2}>
                            <View>
                            {TeamLogo2 && <TeamLogo2 width={40} height={40} />}
                            </View>
                              <Text>{item["Equipo2"]}</Text>
                            </View>
                          </View>
                          <View style={styles.scorers}>
                            <View style={styles.scorers1}>
                              <Text style={styles.text}>{item["Goles1"]}</Text>
                            </View>
                            <View style={styles.scorers2}>
                              <Text style={styles.text}>{item["Goles2"]}</Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rectangleLineargradient: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    width: "100%",
    height: 110,
    position: 'absolute',
  },
  gradientContainer: {
    backgroundColor: '#004A79',
    width: '100%',
    height: 70,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  container: {
    backgroundColor: '#F7F8F9',
    alignItems: 'center',
  },
  containerExpanded: {
    height: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Helvetica",
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  table_scroll: {
    width: '100%',
    backgroundColor: '#F7F8F9',
    marginBottom: 15,
    maxHeight: '90%',
  },
  scrollViewContent: {
    alignItems: 'center',
    backgroundColor: '#F7F8F9',
  },
  allgames: {
    width: '100%',
  },
  date: {
    alignItems: 'center',
    backgroundColor: "#fff",
    flex: 1,
    height: 25,
    marginBottom: 10,
    borderWidth: 1,
    marginHorizontal: 5,
    borderRadius: 10
  },
  match: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5
  },
  team1: {
    flex: 1,
    alignItems: 'center',
  },
  time: {
    flex: 1,
    alignItems: 'center',
  },
  team2: {
    flex: 1,
    alignItems: 'center',
  },
  scorers: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  scorers1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scorers2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  cuadrado: {
    borderWidth: 1,
    marginBottom: 10,
    marginHorizontal: 5,
    borderRadius: 10
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  fechaItem: {
    padding: 15,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  closeButton: {
    padding: 15,
    textAlign: 'center',
    color: 'blue',
    fontWeight: 'bold',
  },
});
