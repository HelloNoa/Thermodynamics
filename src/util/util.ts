export function Clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max));
}

export function RandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215)
                   .toString(16)
                   .padStart(6, '0');
}

export function RandomRGBColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

export function RandomHSLColor() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 100);
  const l = Math.floor(Math.random() * 100);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export class Temperature {
  static readonly minTemp = -273;
  static readonly maxTemp = 273;
}

export function RandomTemperature() {
  return (Math.random() * (Temperature.maxTemp - Temperature.minTemp)) + Temperature.minTemp;
}

export function RandomTemperatureColorHex(temperature: number = RandomTemperature()) {
  // 온도 범위 설정 (예: -20°C ~ 40°C)
  // const minTemp = -140;
  // const maxTemp = 200;
  const minTemp = -273;
  const maxTemp = 10_000;
  
  // 온도를 0~1 사이의 값으로 정규화
  const normalizedTemp = Math.max(0, Math.min(1, (temperature - minTemp) / (maxTemp - minTemp)));
  // const _rgb = SpectrumToRGB(normalizedTemp*100)
  // return `#${toHex(Math.round(_rgb.r))}${toHex(Math.round(_rgb.g))}${toHex(Math.round(_rgb.b))}`;
  return valueToHeatmapColor(normalizedTemp, 0, 1);
}
function valueToHeatmapColor(value:number, min = 0, max = 1) {
  // 값을 0-1 사이로 정규화
  const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min)));
  
  const normalized = (temp:number)=> {
    const min = -273;
    const max = 10_000;
    return Math.max(0, Math.min(1, (temp - min) / (max - min)))
  };
  // 색상 구간 정의
  const colors = [
    { point: 0, r: 10, g: 10, b: 10 },     // 자주색
    { point: normalized(-100), r: 102, g: 0, b: 153 },     // 자주색
    { point: normalized(-50), r: 0, g: 0, b: 255 },     // 파란색
    { point: normalized(-30), r: 0, g: 255, b: 255 }, // 청록색
    { point: normalized(30), r: 0, g: 255, b: 0 },    // 초록색
    { point: normalized(50), r: 255, g: 255, b: 0 }, // 노란색
    { point: normalized(100), r: 255, g: 0, b: 0 },       // 빨간색
    { point: 1, r: 220, g: 20, b: 60 },       // 빨간색
    // { point: 1, r: 40, g: 17, b: 15 }       // 고동색
  ];
  //
  // colors.map((color, index,arr) => {
  //   arr[index].point = index/(arr.length)
  // });
  // 현재 값이 속한 구간 찾기
  let i = 0;
  for (; i < colors.length - 1; i++) {
    if (normalizedValue <= colors[i + 1].point) break;
  }
  
  // 구간 내에서 보간
  const lower = colors[i];
  const upper = colors[Math.min(i + 1, colors.length - 1)];
  const range = upper.point - lower.point;
  const rangePct = range === 0 ? 0 : (normalizedValue - lower.point) / range;
  
  // RGB 값 계산
  const r = Math.floor(lower.r + (upper.r - lower.r) * rangePct);
  const g = Math.floor(lower.g + (upper.g - lower.g) * rangePct);
  const b = Math.floor(lower.b + (upper.b - lower.b) * rangePct);
  
  // Hex 색상 코드로 변환
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// RGB를 HEX로 변환
export const toHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};

export function SpectrumToRGB(percent: number) {
  // 전체 스펙트럼 범위 (nm)
  const SPECTRUM_MIN = 10;  // 자외선 시작
  const SPECTRUM_MAX = 1000;  // 근적외선 끝
  
  // 입력된 퍼센트를 파장으로 변환
  const wavelength = SPECTRUM_MIN + (SPECTRUM_MAX - SPECTRUM_MIN) * (percent / 100);
  
  // 파장을 RGB로 변환
  return WavelengthToRGB(wavelength);
}

function WavelengthToRGB(wavelength: number) {
  let r,
      g,
      b;
  
  // if (wavelength >= 380 && wavelength < 440) {
  if (wavelength < 440) {
    r = (440 - wavelength) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0;
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0;
    g = 1;
    b = (510 - wavelength) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1;
    g = (645 - wavelength) / (645 - 580);
    b = 0;
  } else if (wavelength >= 645 || wavelength <= 780) {
    r = 1;
    g = 0;
    b = 0;
  } else {
    r = 0;
    g = 0;
    b = 0;
  }
  
  // 가시광선 영역 외의 파장에 대한 강도 조절
  let factor;
  // if (wavelength >= 380 && wavelength < 420) {
  if (wavelength < 420) {
    factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
  } else if (wavelength >= 420 && wavelength < 701) {
    factor = 1;
  } else if (wavelength >= 701 && wavelength <= 780) {
    factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700);
  } else {
    factor = 0.3; // 비가시광선 영역의 기본 강도
  }
  
  r = Math.round(255 * Math.pow(r * factor, 0.8));
  g = Math.round(255 * Math.pow(g * factor, 0.8));
  b = Math.round(255 * Math.pow(b * factor, 0.8));
  
  return {
    r,
    g,
    b
  };
}

export function ShuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
