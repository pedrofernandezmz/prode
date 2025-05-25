import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview'; // Importar WebView para YouTube

interface MatchDetailProps {
  gameInfo: string | null; // Recibir gameInfo como prop
}

const MatchDetail: React.FC<MatchDetailProps> = ({ gameInfo }) => {
  const [matchData, setMatchData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar la carga de los datos
  const [error, setError] = useState<string | null>(null); // Para manejar errores de carga

  useEffect(() => {
    if (gameInfo) {
      // Construir la URL dinámica utilizando gameInfo
      const url = `http://127.0.0.1:3000/get_json/${gameInfo}.json`;

      const fetchMatchData = async () => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('No se pudo obtener los datos del partido');
          }
          const data = await response.json();
          setMatchData(data); // Guardar los datos del partido
        } catch (err) {
          setError('Error al cargar los datos');
        } finally {
          setLoading(false); // Cambiar el estado de carga a false cuando termine
        }
      };

      fetchMatchData();
    }
  }, [gameInfo]); // Ejecutar el fetch cada vez que gameInfo cambie

  // Si los datos aún están cargando, mostrar el indicador de carga
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Si hubo un error al cargar los datos
  if (error) {
    return <Text>{error}</Text>;
  }

  // Si los datos están disponibles, renderizarlos
  if (matchData) {
    const {
      Tiempo,
      Equipo1,
      Equipo2,
      Resultado,
      Fecha,
      Estadio,
      Arbitro,
      TV,
      Resumen,
      formacion1,
      formacion2,
    } = matchData;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Detalles del Partido</Text>
        </View>

        {/* Información general del partido */}
        <View style={styles.info}>
          <Text style={styles.infoText}>Fecha: {Fecha}</Text>
          <Text style={styles.infoText}>Estadio: {Estadio}</Text>
          <Text style={styles.infoText}>Árbitro: {Arbitro}</Text>
          <Text style={styles.infoText}>Televisión: {TV}</Text>
          <Text style={styles.infoText}>Estado: {Tiempo}</Text>
          <Text style={styles.result}>
            {Equipo1} {Resultado.Equipo1} - {Resultado.Equipo2} {Equipo2}
          </Text>
        </View>

        <Text>Resumen del Partido</Text>

        {/* WebView para mostrar el video de YouTube */}
        {Resumen ? (
          <WebView
            source={{ uri: Resumen }} // Aquí pasa la URL del video de YouTube
            style={styles.video}
          />
        ) : (
          <Text>No hay video disponible para el resumen</Text>
        )}

        {/* Formación de los equipos */}
        <View style={styles.teamsContainer}>
          <Text style={styles.sectionTitle}>{formacion1.equipo} Formación:</Text>
          {formacion1.titulares.map((jugador, index) => (
            <View key={index} style={styles.player}>
              <Text style={styles.playerText}>
                {jugador.Pos}. {jugador.Jugador} - Edad: {jugador.Edad} - Altura: {jugador['Alt(cm)']} cm
              </Text>
              <View style={styles.playerImages}>
                {jugador.Imagenes.map((img, idx) => (
                  <Image key={idx} source={{ uri: img }} style={styles.playerImage} />
                ))}
              </View>
            </View>
          ))}
          
          <Text style={styles.sectionTitle}>{formacion2.equipo} Formación:</Text>
          {formacion2.titulares.map((jugador, index) => (
            <View key={index} style={styles.player}>
              <Text style={styles.playerText}>
                {jugador.Pos}. {jugador.Jugador} - Edad: {jugador.Edad} - Altura: {jugador['Alt(cm)']} cm
              </Text>
              <View style={styles.playerImages}>
                {jugador.Imagenes.map((img, idx) => (
                  <Image key={idx} source={{ uri: img }} style={styles.playerImage} />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return null; // Si no hay datos, no mostrar nada
};

const styles = StyleSheet.create({
    video: {
        height: 250,
        width: '100%',
        marginVertical: 15,
        borderRadius: 10,
      },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  info: {
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  videoContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  videoLink: {
    fontSize: 16,
    color: '#2980b9',
  },
  stats: {
    marginBottom: 20,
  },
  statsText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
  teamsContainer: {
    marginBottom: 20,
  },
  player: {
    marginBottom: 15,
  },
  playerText: {
    fontSize: 14,
    color: '#34495e',
  },
  playerImages: {
    flexDirection: 'row',
    marginTop: 5,
  },
  playerImage: {
    width: 30,
    height: 30,
    marginRight: 5,
    borderRadius: 5,
  },
});

export default MatchDetail;
