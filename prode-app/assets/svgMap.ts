import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

// Define un tipo para el mapa de SVG
type SvgMap = {
  [key: string]: FC<SvgProps>;
};

// Importa todos los SVG
import argentinos from '@/assets/clubes/argentinos.svg';
import atletico_tucuman from '@/assets/clubes/atletico-tucuman.svg';
import banfield from '@/assets/clubes/banfield.svg';
import barracas from '@/assets/clubes/barracas.svg';
import belgrano from '@/assets/clubes/belgrano.svg';
import boca_juniors from '@/assets/clubes/boca-juniors.svg';
import central_cordoba from '@/assets/clubes/central-cordoba.svg';
import defensa from '@/assets/clubes/defensa.svg';
import estudiantes from '@/assets/clubes/estudiantes.svg';
import gimnasia from '@/assets/clubes/gimnasia.svg';
import godoy_cruz from '@/assets/clubes/godoy_cruz.svg';
import huracan from '@/assets/clubes/huracan.svg';
import independiente_rivadavia from '@/assets/clubes/independiente-rivadavia.svg';
import independiente from '@/assets/clubes/independiente.svg';
import instituto from '@/assets/clubes/instituto.svg';
import lanus from '@/assets/clubes/lanus.svg';
import newells from '@/assets/clubes/newells.svg';
import platense from '@/assets/clubes/platense.svg';
import racing from '@/assets/clubes/racing.svg';
import riestra from '@/assets/clubes/riestra.svg';
import river_plate from '@/assets/clubes/river-plate.svg';
import rosario_central from '@/assets/clubes/rosario-central.svg';
import san_lorenzo from '@/assets/clubes/san-lorenzo.svg';
import sarmiento from '@/assets/clubes/sarmiento.svg';
import talleres from '@/assets/clubes/talleres.svg';
import tigre from '@/assets/clubes/tigre.svg';
import union from '@/assets/clubes/union.svg';
import velez from '@/assets/clubes/velez.svg';

// Crea el mapa de SVG con el tipo definido
const svgMap: SvgMap = {
  argentinos,
  atletico_tucuman,
  banfield,
  barracas,
  belgrano,
  boca_juniors,
  central_cordoba,
  defensa,
  estudiantes,
  gimnasia,
  godoy_cruz,
  huracan,
  independiente_rivadavia,
  independiente,
  instituto,
  lanus,
  newells,
  platense,
  racing,
  riestra,
  river_plate,
  rosario_central,
  san_lorenzo,
  sarmiento,
  talleres,
  tigre,
  union,
  velez
};

export default svgMap;
