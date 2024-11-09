import React, { useState, FC } from 'react';
import { StyleSheet, ScrollView, View, Text, Button} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import partidosData from '@/assets/jsons-test/partidos.json';
import svgMap from '@/assets/svgMap';

// ACA CAMBIAR NOMBRE
export default function Inicio() {
  const [shownDates, setShownDates] = useState<Set<string>>(new Set());

  return (
    <View style={styles.container}>
      <View style={styles.gradientContainer}>
        <LinearGradient 
          style={styles.rectangleLineargradient} 
          locations={[0.28, 1]} 
          colors={['rgba(255, 249, 249, 0.1)', 'rgba(0, 0, 0, 0.2)']} 
        />
        <Button
        title="Boton"
      />
      </View>
      <View>
        <Text style={styles.title}>Fecha N.</Text>
      </View>
      <ScrollView
        style={styles.table_scroll}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.allgames}>
          {partidosData.map((item, index) => {
            // Verifica si ya se mostró la fecha
            const isDateShown = shownDates.has(item["Dia"]);
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
                <View style={styles.match}>
                  <View style={styles.team1}>
                    <Text>IMAGEN1</Text>
                    <Text>{item["Equipo1"]}</Text>
                  </View>
                  <View style={styles.time}>
                    <Text>{item["Tiempo"]}</Text>
                    <Text>{item["Resultado1"]} - {item["Resultado2"]}</Text>
                  </View>
                  <View style={styles.team2}>
                    <Text>IMAGEN2</Text>
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
            );
          })}
        </View>
      </ScrollView>
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
    maxHeight: '82%',
  },
  scrollViewContent: {
    alignItems: 'center',
    backgroundColor: '#F7F8F9',
  },
  allgames: {
    width: '100%',
    borderWidth: 1
  },
  date: {
    alignItems: 'center',
    backgroundColor: "#fff",
    flex: 1,
    height: 25,
    marginBottom: 10,
    borderWidth: 1
  },
  match: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1
  },
  team1: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1
  },
  time: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1
  },
  team2: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1
  },
  scorers: {
    flexDirection: 'row',
    marginBottom: 10,
    borderWidth: 1
  },
  scorers1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1
  },
  scorers2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1
  },
  text: {
    textAlign: 'center',
  },
});
