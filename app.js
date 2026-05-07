// ==============================================================
// 1. IMPORTACIONES (Firebase Cloud SDKs 10.8.1 - CDN Oficial)
// ==============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ==============================================================
// 2. CONFIGURACIÓN EXACTA DE TU FIREBASE (CodeQuestPro)
// ==============================================================
const firebaseConfig = {
  apiKey: "AIzaSyDNBy-QKS5eNSinEI5ROOhR94YGKvbA0cg",
  authDomain: "codequestpro-78796.firebaseapp.com",
  projectId: "codequestpro-78796",
  storageBucket: "codequestpro-78796.firebasestorage.app",
  messagingSenderId: "383335669814",
  appId: "1:383335669814:web:70d1fd4e04b77aca63f897",
  measurementId: "G-V7GPL7TEQC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ==============================================================
// 3. BASE DE DATOS DE CONTENIDO (Las 10 Semanas)
// ==============================================================
const mensajesExito = ["¡Excelente deducción!", "¡Felicidades!", "¡Muy bien hecho!", "¡Brillante!"];
const mensajesFallo = ["No te desanimes.", "Revisa con calma.", "¡Intenta de nuevo!"];

const competenciasMapa = {
  1: "Fundamentos de Electrónica y Pines Digitales", 2: "Lógica Condicional y Secuencias Temporales",
  3: "Lectura de Sensores y Entradas Digitales", 4: "Modulación por Ancho de Pulsos (PWM)",
  5: "Generación de Frecuencias y Sonido", 6: "Cálculo de Distancias con Ultrasonido",
  7: "Control de Actuadores y Servomotores", 8: "Lectura de Sensores Climáticos (DHT11)",
  9: "Comunicación I2C y Pantallas LCD", 10: "Integración de Sistemas (Proyecto Final)"
};

const weeks = {
  1: {
    title: "Primer Contacto (LED)", 
    introduccion: "Aprenderás cómo Arduino envía electricidad al mundo físico.",
    challenge: "Simula el código base. Luego supera los retos modificando el parpadeo.", 
    components: ["Arduino UNO", "LED", "Resistor 220Ω"], 
    wiring: ["PIN 13 → Ánodo LED", "Cátodo LED → Resistencia → GND"], 
    code: `void setup() {\n  pinMode(13, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}`, 
    teoria: {
      basico: { titulo: "Básico: Señales Digitales", contenido: "Un pin digital solo tiene dos estados: HIGH (5V) o LOW (0V). Usamos pinMode() para prepararlo.", ejemplo: "pinMode(13, OUTPUT);\ndigitalWrite(13, HIGH);", monedas: 10 },
      alto: { titulo: "Alto: Resistencias", contenido: "Si conectas un LED a 5V directo se quema. Usamos una resistencia para limitar la corriente.", ejemplo: "// La resistencia absorbe voltaje extra", monedas: 15 },
      superior: { titulo: "Superior: Control de Tiempo", contenido: "Usamos delay() para pausar el código. El tiempo se mide en milisegundos (1000ms = 1s).", ejemplo: "delay(500); // Pausa medio segundo", monedas: 20 }
    },
    explicacion: [ { codigo: "pinMode(13, OUTPUT);", texto: "⚙️ <strong>Configuración:</strong> El pin 13 enviará energía." } ], 
    retos: { 
      basico: { desc: "Agrega un 2do LED en el PIN 12. Enciéndelos a la vez.", match: ["12", "OUTPUT", "HIGH"], pistas: ["Prepara el pin en el setup().", "Usa pinMode(12, OUTPUT);", "En el loop(), usa digitalWrite(12, HIGH);"] }, 
      alto: { desc: "Haz que parpadeen ALTERNADOS: uno prendido mientras el otro apagado.", match: ["13", "12", "HIGH", "LOW"], pistas: ["Si el pin 13 está en HIGH, ¿cómo debería estar el 12?", "Escribe digitalWrite(12, LOW); justo después del 13.", "Invierte los estados después del primer delay()."] }, 
      superior: { desc: "Efecto 'Latido': dos parpadeos rápidos (50ms) y una pausa larga.", match: ["delay(50)"], minCount: { "delay(50": 2 }, pistas: ["Cambia los delay a 50ms para que sea muy rápido.", "Copia el bloque de encender/apagar dos veces seguidas."] } 
    }
  },
  2: {
    title: "Semáforo Inteligente", 
    introduccion: "Aprenderás sobre lógica secuencial. Entenderás cómo el programa lee el código línea por línea.",
    challenge: "Programa la secuencia correcta de un semáforo de 3 colores.", components: ["3x LED (Verde, Amarillo, Rojo)", "3x Resistor 220Ω"], wiring: ["Verde→PIN 2", "Amarillo→PIN 3", "Rojo→PIN 4"], code: `int verde=2, amarillo=3, rojo=4;\nvoid setup() {\n  pinMode(verde, OUTPUT);\n  pinMode(amarillo, OUTPUT);\n  pinMode(rojo, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(verde, HIGH);\n  delay(3000);\n  digitalWrite(verde, LOW);\n}`, 
    teoria: {
      basico: { titulo: "Básico: Bucle Loop", contenido: "Todo dentro de loop() se repite infinitamente.", ejemplo: "digitalWrite(verde, HIGH);\ndelay(1000);", monedas: 10 },
      alto: { titulo: "Alto: Variables", contenido: "En lugar de escribir números de pines todo el tiempo, les ponemos un nombre.", ejemplo: "int verde = 2;", monedas: 15 },
      superior: { titulo: "Superior: Tiempos Diferenciales", contenido: "Los semáforos no tienen el mismo tiempo. Usa delays diferentes para cada color.", ejemplo: "delay(3000); // Verde largo\ndelay(1000); // Amarillo corto", monedas: 20 }
    },
    explicacion: [ { codigo: "int verde=2;", texto: "📦 <strong>Variables:</strong> Guardamos el pin en un nombre." } ], 
    retos: { 
      basico: { desc: "El Verde debe parpadear antes de pasar al amarillo.", match: ["delay("], minCount: {"delay(": 3}, pistas: ["Haz que el verde se apague y prenda rápidamente.", "Pon un delay(200); después de apagar el verde."] }, 
      alto: { desc: "Añade una luz de giro (PIN 5) que parpadee junto al verde.", match: ["5", "OUTPUT", "HIGH"], pistas: ["Declara el pin 5 en la parte de arriba.", "Añade pinMode(5, OUTPUT) en el setup.", "Escribe digitalWrite(5, HIGH) junto al verde."] }, 
      superior: { desc: "Agrega un Buzzer (PIN 9) que pite solo en luz Roja.", match: ["9", "OUTPUT", "tone("], pistas: ["Prepara el pin 9 como OUTPUT.", "Cuando el rojo sea HIGH, lanza tone(9, 440);", "Usa noTone(9); cuando el rojo se apague."] } 
    }
  },
  3: {
    title: "Botón de Pánico", 
    introduccion: "Empezaremos a recibir energía usando resistencias PULLUP internas para leer botones.",
    challenge: "Lee el estado de un botón (Entrada digital) para encender un LED.", components: ["Pushbutton", "LED"], wiring: ["LED→PIN 8", "Botón→PIN 7 (usar GND)"], code: `void setup() {\n  pinMode(8, OUTPUT);\n  pinMode(7, INPUT_PULLUP);\n}\nvoid loop() {\n  if(digitalRead(7) == LOW) {\n    digitalWrite(8, HIGH);\n  } else {\n    digitalWrite(8, LOW);\n  }\n}`, 
    teoria: {
      basico: { titulo: "Básico: Lectura Digital", contenido: "Usamos digitalRead() para leer pines. INPUT_PULLUP evita ruidos eléctricos.", ejemplo: "int estado = digitalRead(7);", monedas: 10 },
      alto: { titulo: "Alto: IF/ELSE", contenido: "Permite decidir qué hacer. Si pasa esto, haz X. Si no, haz Y.", ejemplo: "if (estado == LOW) { }", monedas: 15 },
      superior: { titulo: "Superior: Variables Booleanas", contenido: "Un booleano es 'true' o 'false'. Sirve para guardar estados temporales.", ejemplo: "bool prendido = false;\nprendido = !prendido;", monedas: 20 }
    },
    explicacion: [ { codigo: "if(digitalRead(7) == LOW)", texto: "🔄 <strong>Lógica:</strong> Si el botón es presionado, ejecuta las llaves." } ], 
    retos: { 
      basico: { desc: "Agrega otro LED (PIN 9). Si presionas: prende 9 y apaga 8.", match: ["9", "OUTPUT", "HIGH"], pistas: ["Añade el pinMode para el 9 en el setup.", "Dentro del IF, prende el 9 y apaga el 8."] }, 
      alto: { desc: "Al presionar, el LED debe parpadear simulando una alarma policial.", match: ["delay("], pistas: ["Necesitas pausas de tiempo dentro del IF.", "Agrega digitalWrite y delay intercalados."] }, 
      superior: { desc: "Hazlo un interruptor (una pulsación prende, otra apaga).", match: ["bool", "!"], pistas: ["Crea una variable booleana arriba.", "Inviértela: estado = !estado;", "Usa otro IF para evaluar si 'estado' es verdadero o falso."] } 
    }
  },
  4: {
    title: "Dimmer Analógico (PWM)", 
    introduccion: "Aprenderás la Modulación por Ancho de Pulsos (PWM) para simular valores intermedios.",
    challenge: "Usa un potenciómetro para variar el brillo de un LED suavemente.", components: ["Potenciómetro", "LED (en Pin PWM ~)"], wiring: ["Potenciómetro→A0", "LED→PIN 9"], code: `int pot = A0;\nint led = 9;\nvoid setup() {\n  pinMode(led, OUTPUT);\n}\nvoid loop() {\n  int val = analogRead(pot);\n  int brillo = map(val, 0, 1023, 0, 255);\n  analogWrite(led, brillo);\n}`, 
    teoria: {
      basico: { titulo: "Básico: Entradas Analógicas", contenido: "El potenciómetro envía niveles de voltaje que analogRead() lee de 0 a 1023.", ejemplo: "int val = analogRead(A0);", monedas: 10 },
      alto: { titulo: "Alto: La función MAP", contenido: "MAP convierte proporcionalmente una escala a otra de forma automática.", ejemplo: "map(valor, 0, 1023, 0, 255);", monedas: 15 },
      superior: { titulo: "Superior: Salidas PWM", contenido: "Los pines con '~' simulan voltajes intermedios parpadeando muy rápido.", ejemplo: "analogWrite(9, 127);", monedas: 20 }
    },
    explicacion: [ { codigo: "map(val, 0, 1023, 0, 255);", texto: "📏 <strong>Mapeo:</strong> Convierte la escala de 1023 a 255." } ], 
    retos: { 
      basico: { desc: "Imprime el valor del potenciómetro en el Monitor Serie.", match: ["Serial.begin", "Serial.print"], pistas: ["Inicia la consola en el setup() con Serial.begin(9600);", "Usa Serial.println(val); en el loop()."] }, 
      alto: { desc: "Agrega un segundo LED (PIN 10) que funcione al revés (inversamente proporcional).", match: ["10", "OUTPUT", "255-"], pistas: ["Si el brillo del 9 sube, el del 10 debe bajar.", "Usa analogWrite(10, 255 - brillo);"] }, 
      superior: { desc: "Crea una 'zona muerta'. Si el valor analógico es menor a 100, ambos LEDs se apagan.", match: ["if", "100", "0"], pistas: ["Usa un IF para evaluar la variable 'val'.", "Si val < 100, pon analogWrite a 0."] } 
    }
  },
  5: {
    title: "Sintetizador (Buzzer)", 
    introduccion: "Exploraremos el mundo de las frecuencias de sonido convirtiendo señales en notas usando tone().",
    challenge: "Genera frecuencias y melodías utilizando código.", components: ["Buzzer Piezoeléctrico"], wiring: ["Buzzer Positivo→PIN 8", "Negativo→GND"], code: `int buzzer = 8;\nvoid setup() {\n  pinMode(buzzer, OUTPUT);\n}\nvoid loop() {\n  tone(buzzer, 440);\n  delay(500);\n  noTone(buzzer);\n  delay(1000);\n}`, 
    teoria: {
      basico: { titulo: "Básico: Frecuencias (Hz)", contenido: "tone() envía pulsos eléctricos al Buzzer. 440Hz equivale a la nota 'La'.", ejemplo: "tone(8, 440);", monedas: 10 },
      alto: { titulo: "Alto: Silencios Obligatorios", contenido: "Para separar notas se necesita pausarlo usando noTone().", ejemplo: "noTone(8);", monedas: 15 },
      superior: { titulo: "Superior: Ciclo FOR", contenido: "Para no repetir código, usamos bucles (FOR) que repiten las acciones.", ejemplo: "for(int i=0; i<3; i++) { }", monedas: 20 }
    },
    explicacion: [ { codigo: "tone(buzzer, 440);", texto: "🎵 <strong>Frecuencia:</strong> Vibra 440 veces por segundo." } ], 
    retos: { 
      basico: { desc: "Toca 3 notas distintas creando una pequeña melodía.", match: ["tone(", "delay("], minCount: {"tone(": 3}, pistas: ["Copia y pega el bloque tone y delay 3 veces.", "Cambia los números (440) por otros valores."] }, 
      alto: { desc: "Conecta un LED (PIN 7) que se encienda SOLO cuando esté sonando la melodía.", match: ["7", "OUTPUT", "HIGH"], pistas: ["Usa digitalWrite(7, HIGH) justo antes del primer tone."] }, 
      superior: { desc: "Reproduce la melodía usando un bucle FOR.", match: ["for("], pistas: ["La estructura es: for(int i=0; i<3; i++) { ... }", "Pon tu tone() dentro de las llaves del for."] } 
    }
  },
  6: {
    title: "Radar Automotriz", 
    introduccion: "Aprenderemos sobre ecolocalización para calcular distancias enviando pulsos ultrasónicos.",
    challenge: "Mide distancias usando un sensor ultrasónico HC-SR04.", components: ["Sensor HC-SR04"], wiring: ["Trig→PIN 3", "Echo→PIN 2"], code: `int trig=3; int echo=2;\nvoid setup() {\n Serial.begin(9600);\n pinMode(trig, OUTPUT);\n pinMode(echo, INPUT);\n}\nvoid loop() {\n digitalWrite(trig, LOW); delayMicroseconds(2);\n digitalWrite(trig, HIGH); delayMicroseconds(10);\n digitalWrite(trig, LOW);\n long t = pulseIn(echo, HIGH);\n long d = t / 59;\n Serial.println(d);\n delay(100);\n}`, 
    teoria: {
      basico: { titulo: "Básico: Disparo Ultrasónico", contenido: "El pin 'Trig' envía un pulso de solo 10 microsegundos.", ejemplo: "delayMicroseconds(10);", monedas: 10 },
      alto: { titulo: "Alto: Recepción y pulseIn()", contenido: "El pin 'Echo' cuenta el tiempo que tarda el eco en regresar.", ejemplo: "long tiempo = pulseIn(echo, HIGH);", monedas: 15 },
      superior: { titulo: "Superior: La Matemática", contenido: "Dividimos el tiempo de vuelo entre 59 para obtener los centímetros.", ejemplo: "long d = t / 59;", monedas: 20 }
    },
    explicacion: [ { codigo: "pulseIn(echo, HIGH);", texto: "⏱️ <strong>Escucha:</strong> Cuenta el tiempo del eco." } ], 
    retos: { 
      basico: { desc: "Enciende un LED de alerta (PIN 4) si un objeto está a menos de 20cm.", match: ["if", "20", "4", "HIGH"], pistas: ["Necesitas un condicional IF evaluando la variable 'd'."] }, 
      alto: { desc: "Agrega un Buzzer (PIN 5) que pite solo si la distancia es menor a 10cm.", match: ["5", "OUTPUT", "10", "tone("], pistas: ["Crea un if secundario que pregunte si d < 10."] }, 
      superior: { desc: "Sensor de reversa real: Haz que el delay del pitido dependa de la distancia.", match: ["*"], pistas: ["Cambia el delay fijo del final por una fórmula usando d * 10."] } 
    }
  },
  7: {
    title: "Barrera de Peaje (Servo)", 
    introduccion: "Descubrirás cómo incluir Librerías para controlar motores indicándoles un ángulo exacto.",
    challenge: "Usa librerías para controlar un motor con precisión milimétrica.", components: ["Micro Servo SG90"], wiring: ["Cable Naranja (Señal) → PIN 9"], code: `#include <Servo.h>\nServo miServo;\nvoid setup() {\n miServo.attach(9);\n}\nvoid loop() {\n miServo.write(0);\n delay(1000);\n miServo.write(90);\n delay(1000);\n}`, 
    teoria: {
      basico: { titulo: "Básico: Librerías", contenido: "Las librerías enseñan a Arduino comandos complejos nuevos.", ejemplo: "#include <Servo.h>", monedas: 10 },
      alto: { titulo: "Alto: Objetos", contenido: "Debemos crear un 'objeto' (clon) del motor para darle órdenes.", ejemplo: "Servo miServo;", monedas: 15 },
      superior: { titulo: "Superior: write()", contenido: "Los servos se mueven de 0° a 180° grados exactos.", ejemplo: "miServo.write(90);", monedas: 20 }
    },
    explicacion: [ { codigo: "miServo.write(90);", texto: "📐 <strong>Ángulo:</strong> Gira el eje a 90 grados." } ], 
    retos: { 
      basico: { desc: "Modifica la barrera para que se abra totalmente (hasta 180 grados).", match: ["180"], pistas: ["Solo tienes que cambiar el 90 por 180 en el .write()"] }, 
      alto: { desc: "Conecta un Botón (PIN 7). Si lo presionas abre a 90, si lo sueltas vuelve a 0.", match: ["digitalRead(7)"], pistas: ["Crea un if (digitalRead(7) == LOW) para abrir."] }, 
      superior: { desc: "Haz que la barrera suba LENTAMENTE usando un bucle FOR.", match: ["for(", "++"], pistas: ["La estructura es: for(int i=0; i<=90; i++)", "Dentro del for pon: miServo.write(i); delay(15);"] } 
    }
  },
  8: {
    title: "Estación Climática", 
    introduccion: "Usaremos Operadores Lógicos como AND (&&) y OR (||) para múltiples condiciones.",
    challenge: "Lee la temperatura de tu entorno utilizando el DHT11.", components: ["Sensor DHT11"], wiring: ["Data (OUT) → PIN 2"], code: `#include <DHT.h>\nDHT dht(2, DHT11);\nvoid setup() {\n Serial.begin(9600);\n dht.begin();\n}\nvoid loop() {\n float t = dht.readTemperature();\n Serial.println(t);\n delay(2000);\n}`, 
    teoria: {
      basico: { titulo: "Básico: Sensores de Datos", contenido: "El DHT11 envía un 'paquete' de datos decodificado.", ejemplo: "dht.readTemperature();", monedas: 10 },
      alto: { titulo: "Alto: Variables Float", contenido: "'float' permite guardar decimales para datos no enteros.", ejemplo: "float t = 24.5;", monedas: 15 },
      superior: { titulo: "Superior: Operadores Lógicos", contenido: "Usamos && (Y) para requerir dos condiciones obligatorias simultáneas.", ejemplo: "if (temp > 30 && hum > 70)", monedas: 20 }
    },
    explicacion: [ { codigo: "float t = dht.readTemperature();", texto: "🌡️ <strong>Lectura:</strong> Guarda los grados con decimales." } ], 
    retos: { 
      basico: { desc: "Imprime también la humedad (h) usando dht.readHumidity().", match: ["readHumidity", "Serial.print"], pistas: ["Crea una variable llamada 'h' tipo float.", "Usa h = dht.readHumidity();"] }, 
      alto: { desc: "Agrega un ventilador (LED en PIN 5) que se encienda si la temperatura supera 30°C.", match: ["if", "30", "5", "HIGH"], pistas: ["Usa la condicional: if(t > 30)", "Prende el 5 dentro de ese IF."] }, 
      superior: { desc: "Alerta climática: El LED parpadea SÓLO si temperatura > 30 Y humedad > 70.", match: ["&&", "70"], pistas: ["Combina dos condiciones en el mismo IF usando &&."] } 
    }
  },
  9: {
    title: "Panel Publicitario", 
    introduccion: "Aprenderás sobre el protocolo de comunicación serial I2C.",
    challenge: "Muestra texto en una pantalla LCD 16x2 vía I2C.", components: ["Pantalla LCD 16x2 I2C"], wiring: ["SDA→A4", "SCL→A5"], code: `#include <LiquidCrystal_I2C.h>\nLiquidCrystal_I2C lcd(0x27, 16, 2);\nvoid setup() {\n lcd.init();\n lcd.backlight();\n lcd.setCursor(0,0);\n lcd.print("Hola Mundo");\n}\nvoid loop() {\n}`, 
    teoria: {
      basico: { titulo: "Básico: Protocolo I2C", contenido: "I2C reduce cables a 2 (SDA y SCL). Cada pantalla tiene una dirección (0x27).", ejemplo: "LiquidCrystal_I2C lcd(0x27, 16, 2);", monedas: 10 },
      alto: { titulo: "Alto: El Cursor", contenido: "Debes indicarle columna (0-15) y fila (0-1) para ubicar el lápiz invisible.", ejemplo: "lcd.setCursor(0, 1);", monedas: 15 },
      superior: { titulo: "Superior: Limpiar (Clear)", contenido: "Si no borras el texto anterior, las letras nuevas se enciman como una sopa.", ejemplo: "lcd.clear();", monedas: 20 }
    },
    explicacion: [ { codigo: "lcd.setCursor(0,0);", texto: "📍 <strong>Cursor:</strong> Lápiz en columna 0, fila 0 (arriba)." } ], 
    retos: { 
      basico: { desc: "Escribe tu nombre abajo: Muévelo a la Fila 1 (setCursor(0,1)).", match: ["setCursor(0,1)", "print"], pistas: ["Añade comandos nuevos justo después del 'Hola Mundo'.", "Usa lcd.setCursor(0, 1);"] }, 
      alto: { desc: "Haz que el texto parpadee en el loop() limpiando la pantalla con lcd.clear().", match: ["clear()", "delay("], pistas: ["Corta los comandos del setup() y pásalos al loop().", "Agrega delay(500) y luego el comando lcd.clear()"] }, 
      superior: { desc: "Haz un mensaje marquesina deslizándose a la izquierda usando scrollDisplayLeft().", match: ["scrollDisplayLeft()"], pistas: ["Dentro del loop, solo debes poner lcd.scrollDisplayLeft();"] } 
    }
  },
  10: {
    title: "BOSS FINAL", 
    introduccion: "¡Llegó la hora de la verdad! En este proyecto integrador tendrás que combinar TODO tu conocimiento.",
    challenge: "Integra radar, servo, luces y sonido en un solo código maestro.", components: ["Radar", "Servo", "Buzzer", "Botón", "2x LED"], wiring: ["Radar(3,2)", "Servo(9)", "Buzzer(8)", "Boton(7)", "LEDs(5,4)"], code: `// ⚠️ BOSS FINAL ⚠️\n// Crea tu propia lógica desde cero.\nvoid setup() {\n  \n}\nvoid loop() {\n  \n}`, 
    teoria: {
      basico: { titulo: "Básico: Planificación", contenido: "Imagina: ¿Qué lee datos (INPUT)? ¿Qué actúa (OUTPUT)?", ejemplo: "// 1. Leer radar\n// 2. Decidir", monedas: 10 },
      alto: { titulo: "Alto: Modularidad", contenido: "No escribas todo de golpe. Primero radar, comprueba. Luego servo.", ejemplo: "Serial.println(distancia);", monedas: 15 },
      superior: { titulo: "Superior: Lógica Maestra", contenido: "Unirás compuertas (&&) y condicionales gigantes para gobernar el circuito.", ejemplo: "if (d < 20 && boton == LOW)", monedas: 20 }
    },
    explicacion: [ { codigo: "// ¡Todo depende de ti!", texto: "🏆 <strong>Evaluación Final:</strong> Integra librerías, configura pines y haz la lógica." } ], 
    retos: { 
      basico: { desc: "Abre la talanquera (Servo a 90°) SOLO si el radar lee menos de 15cm.", match: ["pulseIn", "write(90)", "15"], pistas: ["Agrega el código completo del Radar de la Semana 6.", "Usa if (distancia < 15) { miServo.write(90); }"] }, 
      alto: { desc: "La talanquera solo abre si el auto está cerca Y presionan el botón.", match: ["&&", "digitalRead"], pistas: ["En el mismo IF de la distancia, usa && para evaluar el botón."] }, 
      superior: { desc: "Sistema Full: LED Verde al abrir, LED Rojo y pitido al cerrar.", match: ["tone", "HIGH", "LOW"], pistas: ["El LED Rojo y el sonido es cuando se cierra (dentro del ELSE)."] } 
    }
  }
};


// ==============================================================
// 4. BASE DE DATOS DE LA TIENDA VIRTUAL
// ==============================================================
const tiendaItems = {
  avatars: [
    { id: 'user', icon: 'user', name: 'Estudiante', price: 0 },
    { id: 'bot', icon: 'bot', name: 'Robo Wokwi', price: 50 },
    { id: 'rocket', icon: 'rocket', name: 'Cohete', price: 100 },
    { id: 'alien', icon: 'alien', name: 'Alien', price: 150 },
    { id: 'ghost', icon: 'ghost', name: 'Fantasma', price: 200 },
    { id: 'sword', icon: 'sword', name: 'Guerrero', price: 300 }
  ],
  themes: [
    { id: 'blue', color: '#2f81f7', name: 'Wokwi Azul (Default)', price: 0 },
    { id: 'green', color: '#22c55e', name: 'Hacker Matrix', price: 100 },
    { id: 'purple', color: '#a855f7', name: 'Neón Morado', price: 150 },
    { id: 'orange', color: '#f97316', name: 'Fuego Carmesí', price: 200 },
    { id: 'pink', color: '#ec4899', name: 'Rosa Cyberpunk', price: 300 }
  ]
};

// ==============================================================
// 5. VARIABLES GLOBALES DEL SISTEMA Y USUARIO
// ==============================================================
let currentUser = null;
let currentRetoId = '1';
let timers = {}; let intervalos = {}; 
let fallos = { basico: 0, alto: 0, superior: 0 };
let pistasDesbloqueadas = { basico: 0, alto: 0, superior: 0 };
let vidas = { basico: 3, alto: 3, superior: 3 };

let userData = {
  nombres: "", email: "", grado: "",
  volts: 0, monedas: 0, streak: 0, lastLogin: "",
  progress: {}, records: {}, savedCodes: {}, drafts: {}, teoria: {},
  // NUEVO: Inventario y equipamiento
  avatar: "user", theme: "blue", 
  inventory: { avatars: ["user"], themes: ["blue"] }
};


// ==============================================================
// 6. AUTENTICACIÓN Y CONEXIÓN A FIRESTORE
// ==============================================================
window.loginConGoogle = async function() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if(!user.email.endsWith('@itspereira.edu.co')) {
      await signOut(auth);
      document.getElementById('login-error').style.display = 'block';
      document.getElementById('login-error').textContent = 'Acceso denegado. Usa tu cuenta @itspereira.edu.co';
      return;
    }

    document.getElementById('login-error').style.display = 'none';

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      userData = docSnap.data(); 
      // Migraciones de versiones anteriores
      if(!userData.savedCodes) userData.savedCodes = {};
      if(!userData.drafts) userData.drafts = {};
      if(!userData.teoria) userData.teoria = {};
      if(!userData.inventory) {
        userData.avatar = "user"; userData.theme = "blue";
        userData.inventory = { avatars: ["user"], themes: ["blue"] };
      }
    } else {
      let gradoIngresado = prompt("¡Bienvenido a Wokwi Academy!\nPor favor, ingresa tu grado (Ej: 10A, 11B):");
      userData = {
        nombres: user.displayName, email: user.email, grado: gradoIngresado || "Sin Grado",
        volts: 0, monedas: 0, streak: 0, lastLogin: "",
        progress: {}, records: {}, savedCodes: {}, drafts: {}, teoria: {},
        avatar: "user", theme: "blue", inventory: { avatars: ["user"], themes: ["blue"] }
      };
      await saveToFirebase();
    }

    currentUser = user;
    iniciarApp();
  } catch (error) {
    console.error("Error en Login:", error);
    document.getElementById('login-error').style.display = 'block';
    document.getElementById('login-error').textContent = 'Error de conexión. Intenta nuevamente.';
  }
};

window.logout = async function() {
  if(confirm("Tus datos están a salvo en la Nube ☁️. ¿Deseas cerrar sesión?")) {
    await saveToFirebase(); 
    await signOut(auth);
    window.location.reload(); 
  }
};

async function saveToFirebase() {
  if(!currentUser) return;
  try { await setDoc(doc(db, "users", currentUser.uid), userData, { merge: true }); } 
  catch (e) { console.error("Error guardando en la nube:", e); }
}

let timeoutGuardado;
function autoGuardarEnNube() {
  clearTimeout(timeoutGuardado);
  timeoutGuardado = setTimeout(() => { saveToFirebase(); }, 2000); 
}

// ==============================================================
// 7. FLUJO DE LA APP Y PERSONALIZACIÓN (TEMA Y AVATAR)
// ==============================================================
function iniciarApp() {
  document.getElementById('screen-login').classList.remove('active');
  document.getElementById('screen-app').classList.add('active');
  
  // Aplicar Tema y Avatar en UI
  aplicarTemaYAvatarUI();

  const headerButtons = document.getElementById('header-buttons');
  const badge = document.createElement('div'); 
  badge.className = 'user-badge flex-icon';
  badge.innerHTML = `<i id="header-avatar" data-lucide="${userData.avatar}"></i> <span>${userData.nombres.split(' ')[0]}</span> <button class="btn-logout flex-icon" onclick="window.logout()" title="Cerrar Sesión"><i data-lucide="log-out"></i> Salir</button>`;
  headerButtons.appendChild(badge);

  cargarDatosGamificacion(); 
  window.loadWeek(); 
  updateProgress(); 
  if (window.lucide) lucide.createIcons();
}

function aplicarTemaYAvatarUI() {
  const themeObj = tiendaItems.themes.find(t => t.id === userData.theme) || tiendaItems.themes[0];
  document.documentElement.style.setProperty('--wokwi-blue', themeObj.color);
  
  const iconEl = document.getElementById('header-avatar');
  if(iconEl) {
    iconEl.setAttribute('data-lucide', userData.avatar);
    if (window.lucide) lucide.createIcons();
  }
}

// ==============================================================
// 8. MODAL DE GAMIFICACIÓN: RANKING Y TIENDA
// ==============================================================
window.abrirModalGamificacion = function() {
  document.getElementById('modal-gamification').style.display = 'flex';
  cambiarTabGamificacion('ranking');
}

window.cerrarModalGamificacion = function() {
  document.getElementById('modal-gamification').style.display = 'none';
}

window.cambiarTabGamificacion = function(tab) {
  document.getElementById('btn-tab-ranking').classList.remove('active');
  document.getElementById('btn-tab-tienda').classList.remove('active');
  document.getElementById('tab-ranking').style.display = 'none';
  document.getElementById('tab-tienda').style.display = 'none';
  
  document.getElementById(`btn-tab-${tab}`).classList.add('active');
  document.getElementById(`tab-${tab}`).style.display = 'block';

  if (tab === 'ranking') cargarRankingNube();
  if (tab === 'tienda') renderTiendaUI();
}

// LECTURA DE FIREBASE PARA EL TOP 5 LEADERBOARD
async function cargarRankingNube() {
  const tbody = document.getElementById('ranking-tbody');
  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;"><i data-lucide="loader-2" class="lucide-spin"></i> Conectando a la Nube...</td></tr>`;
  if (window.lucide) lucide.createIcons();

  try {
    const q = query(collection(db, "users"), orderBy("monedas", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    
    let html = ''; let rank = 1;
    querySnapshot.forEach((docSnap) => {
      let d = docSnap.data();
      let iconColor = rank === 1 ? '#fbbf24' : (rank === 2 ? '#94a3b8' : (rank === 3 ? '#b45309' : 'var(--text-light)'));
      let badge = rank === 1 ? '👑' : `#${rank}`;
      
      html += `<tr>
        <td style="color:${iconColor}; font-size:1.1rem;">${badge}</td>
        <td><div class="flex-icon" style="justify-content:flex-start;"><i data-lucide="${d.avatar || 'user'}"></i> ${d.nombres}</div></td>
        <td>${d.grado || 'N/A'}</td>
        <td style="color:#e3b341; font-weight:bold;">🪙 ${d.monedas || 0}</td>
        <td style="color:#ff5722;">🔥 ${d.streak || 0}</td>
      </tr>`;
      rank++;
    });

    if(html === '') html = `<tr><td colspan="5" style="text-align:center;">No hay datos suficientes aún.</td></tr>`;
    tbody.innerHTML = html;
    if (window.lucide) lucide.createIcons();

  } catch (error) {
    console.error("Error cargando ranking", error);
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--error-color);">Error de conexión al cargar Ranking.</td></tr>`;
  }
}

// TIENDA: RENDERIZADO Y COMPRA
function renderTiendaUI() {
  document.getElementById('tienda-user-monedas').innerText = userData.monedas;

  // Avatares
  const avContainer = document.getElementById('store-avatars');
  avContainer.innerHTML = tiendaItems.avatars.map(item => {
    let isOwned = userData.inventory.avatars.includes(item.id);
    let isActive = userData.avatar === item.id;
    
    let btnHtml = '';
    if (isActive) btnHtml = `<button class="btn-equipped">Equipado</button>`;
    else if (isOwned) btnHtml = `<button class="btn-equip" onclick="window.equiparArticulo('avatar', '${item.id}')">Equipar</button>`;
    else btnHtml = `<button class="btn-buy" onclick="window.comprarArticulo('avatar', '${item.id}')">Comprar 🪙 ${item.price}</button>`;

    return `<div class="store-item ${isOwned ? 'owned' : ''} ${isActive ? 'active' : ''}">
      <i data-lucide="${item.icon}" style="width:40px; height:40px; color:${isActive ? 'var(--wokwi-blue)' : 'var(--text-light)'};"></i>
      <div style="font-weight:bold;">${item.name}</div>
      ${btnHtml}
    </div>`;
  }).join('');

  // Temas
  const thContainer = document.getElementById('store-themes');
  thContainer.innerHTML = tiendaItems.themes.map(item => {
    let isOwned = userData.inventory.themes.includes(item.id);
    let isActive = userData.theme === item.id;
    
    let btnHtml = '';
    if (isActive) btnHtml = `<button class="btn-equipped" style="background:${item.color};">Equipado</button>`;
    else if (isOwned) btnHtml = `<button class="btn-equip" onclick="window.equiparArticulo('theme', '${item.id}')">Equipar</button>`;
    else btnHtml = `<button class="btn-buy" onclick="window.comprarArticulo('theme', '${item.id}')">Comprar 🪙 ${item.price}</button>`;

    return `<div class="store-item ${isOwned ? 'owned' : ''} ${isActive ? 'active' : ''}">
      <div style="width:40px; height:40px; border-radius:50%; background:${item.color}; border: 2px solid white;"></div>
      <div style="font-weight:bold;">${item.name}</div>
      ${btnHtml}
    </div>`;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

window.comprarArticulo = function(tipo, id) {
  let list = tipo === 'avatar' ? tiendaItems.avatars : tiendaItems.themes;
  let invList = tipo === 'avatar' ? userData.inventory.avatars : userData.inventory.themes;
  
  let item = list.find(i => i.id === id);
  if(!item) return;

  if (userData.monedas >= item.price) {
    userData.monedas -= item.price;
    invList.push(item.id);
    
    if (tipo === 'avatar') userData.avatar = item.id;
    if (tipo === 'theme') userData.theme = item.id;

    saveToFirebase();
    aplicarTemaYAvatarUI();
    document.getElementById('user-monedas').innerText = userData.monedas;
    playCoinSound();
    renderTiendaUI();
  } else {
    playErrorSound();
    alert(`🪙 No tienes suficientes Monedas (Cuesta ${item.price}). ¡Supera niveles y lee la teoría!`);
  }
}

window.equiparArticulo = function(tipo, id) {
  if (tipo === 'avatar') userData.avatar = id;
  if (tipo === 'theme') userData.theme = id;
  
  saveToFirebase();
  aplicarTemaYAvatarUI();
  playLifeSound();
  renderTiendaUI();
}


// ==============================================================
// 9. FUNCIONES GAMIFICACIÓN LOCAL (Pistas, Vida, Teoría)
// ==============================================================
function cargarDatosGamificacion() {
  document.getElementById('stats-panel').style.display = 'flex';
  document.getElementById('volts-count').innerText = userData.volts || 0;
  document.getElementById('user-monedas').innerText = userData.monedas || 0;

  const hoy = new Date().toDateString();
  if (userData.lastLogin !== hoy) {
    if (userData.lastLogin) {
      const diffDias = Math.ceil(Math.abs(new Date(hoy) - new Date(userData.lastLogin)) / (1000 * 60 * 60 * 24));
      if (diffDias === 1) userData.streak += 1; else userData.streak = 1; 
    } else userData.streak = 1; 
    userData.lastLogin = hoy; saveToFirebase();
  }
  document.getElementById('streak-count').innerText = userData.streak || 0;
}

window.reclamarMonedas = function(semanaId, nivel, cantidad) {
  const claveReclamada = `teoria_leida_${semanaId}_${nivel}`;
  if (userData.teoria[claveReclamada] === true) return;

  userData.monedas += cantidad; userData.teoria[claveReclamada] = true;
  document.getElementById('user-monedas').innerText = userData.monedas;
  saveToFirebase();

  const btn = document.getElementById(`btn-teoria-${nivel}`);
  btn.classList.add('reclamado'); btn.innerText = '✔️ Recompensa Reclamada'; btn.onclick = null;
  playCoinSound(); confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
};

window.ganarVolts = function(cantidad) {
  userData.volts += cantidad; document.getElementById('volts-count').innerText = userData.volts; 
  playCoinSound(); saveToFirebase();
}

window.comprarEnergia = function(nivel) {
  if (userData.monedas >= 10) {
    userData.monedas -= 10; document.getElementById('user-monedas').innerText = userData.monedas; saveToFirebase();
    vidas[nivel] = 3; document.getElementById(`vidas-${nivel}`).innerHTML = '❤️❤️❤️';
    document.getElementById(`input-${nivel}`).disabled = false; document.getElementById(`feedback-${nivel}`).style.display = 'none';
    document.getElementById(`btn-container-${nivel}`).innerHTML = `<button id="btn-${nivel}" class="btn-verify flex-icon" onclick="window.verifyCode('${nivel}')"><i data-lucide="play"></i> Verificar Código</button>`;
    playLifeSound(); if (window.lucide) lucide.createIcons();
  } else { playErrorSound(); alert("🪙 No tienes suficientes Monedas (Necesitas 10)."); }
};

window.comprarPista = function(nivel) {
  const reto = weeks[currentRetoId].retos[nivel];
  if (pistasDesbloqueadas[nivel] >= reto.pistas.length) return;

  if (userData.volts >= 5) {
    userData.volts -= 5; document.getElementById('volts-count').innerText = userData.volts; saveToFirebase();
    playCoinSound(); pistasDesbloqueadas[nivel]++; renderPistas(nivel, reto);
  } else { playErrorSound(); alert("⚡ No tienes suficientes Volts (Necesitas 5)."); }
};

function renderPistas(nivel, reto) {
  const pistaBox = document.getElementById(`pista-${nivel}`); pistaBox.classList.add('visible'); pistaBox.innerHTML = ''; 
  for(let i=0; i < pistasDesbloqueadas[nivel]; i++) { pistaBox.innerHTML += `<div class="pista-item"><strong>Pista ${i+1}:</strong> ${reto.pistas[i]}</div>`; }
  if (pistasDesbloqueadas[nivel] < reto.pistas.length) { pistaBox.innerHTML += `<button class="btn-comprar-pista flex-icon" onclick="window.comprarPista('${nivel}')"><i data-lucide="unlock"></i> Comprar Pista (5 ⚡)</button>`; }
  if (window.lucide) lucide.createIcons();
}


// ==============================================================
// 10. MOTOR DE EVALUACIÓN (Linter Didáctico y Antitrampas)
// ==============================================================
function limpiarCodigo(codigoRaw) {
  return codigoRaw.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
}

function linterDidactico(codigoLimpio) {
  let errores = [];
  let llaves = 0, parentesis = 0;
  for (let char of codigoLimpio) {
    if (char === '{') llaves++; if (char === '}') llaves--;
    if (char === '(') parentesis++; if (char === ')') parentesis--;
  }
  
  if (llaves !== 0) errores.push("⚖️ <strong>¡Desbalance de llaves {}!</strong> Todo bloque que abres debes cerrarlo.");
  if (parentesis !== 0) errores.push("⚖️ <strong>¡Paréntesis huérfano ()!</strong> Revisa las condiciones, te falta cerrar un paréntesis.");

  const lineas = codigoLimpio.split('\n');
  lineas.forEach((linea) => {
    let l = linea.trim();
    if (l.length === 0 || l.startsWith('#') || l.endsWith('{') || l === '}') return;
    if (l.startsWith('if') || l.startsWith('for') || l.startsWith('while') || l.startsWith('else')) return;

    const inst = /pinMode|digitalWrite|analogWrite|delay|Serial|lcd|servo|tone|noTone|int|float|bool|long/i;
    if (inst.test(l) && !l.endsWith(';')) {
      let lineaCorta = l.length > 30 ? l.substring(0, 30) + '...' : l;
      errores.push(`🔍 Arduino no sabe dónde termina la orden <code>${lineaCorta}</code>. ¿Olvidaste el punto y coma (;) al final?`);
    }
  });
  return errores;
}

window.validarSintaxis = function(nivel) {
  const txt = document.getElementById(`input-${nivel}`); if(!txt) return;
  const val = txt.value; 
  
  if(currentUser) {
    if(!userData.drafts) userData.drafts = {};
    userData.drafts[`draft_${currentRetoId}_${nivel}`] = val;
    autoGuardarEnNube(); 
  }

  const bar = document.getElementById(`syntax-${nivel}`); let tags = [];
  if (val.length < 5) { txt.classList.remove('syntax-ok','syntax-error'); bar.innerHTML = '<span class="syntax-chip chip-info">Escribe para analizar...</span>'; return; }
  
  let ok = true;
  if(val.includes('setup()') && val.includes('loop()')) tags.push('<span class="syntax-chip chip-ok"><i data-lucide="check"></i> Estructura</span>'); else { tags.push('<span class="syntax-chip chip-error"><i data-lucide="x"></i> Falta setup/loop</span>'); ok = false; }
  if (ok) { txt.classList.add('syntax-ok'); txt.classList.remove('syntax-error'); } else { txt.classList.add('syntax-error'); txt.classList.remove('syntax-ok'); }
  bar.innerHTML = tags.join(''); if (window.lucide) lucide.createIcons();
}

window.verifyCode = function(nivel) {
  if (vidas[nivel] <= 0) return;
  initAudio(); 
  const btn = document.getElementById(`btn-${nivel}`); btn.innerHTML = `<i data-lucide="loader-2" class="lucide-spin"></i> Analizando...`; btn.disabled = true;

  setTimeout(() => {
    const originalCode = document.getElementById(`input-${nivel}`).value;
    const fb = document.getElementById(`feedback-${nivel}`);
    const codigoLimpio = limpiarCodigo(originalCode);
    const erroresSintaxis = linterDidactico(codigoLimpio);

    if (erroresSintaxis.length > 0) {
       fb.className = "feedback error"; fb.style.borderColor = "var(--warning-color)"; fb.style.backgroundColor = "rgba(214,158,46,0.1)"; 
       let listaErrores = erroresSintaxis.map(e => `<li style="margin-bottom:6px; color: var(--text-light);">${e}</li>`).join('');
       fb.innerHTML = `
         <div style="color: var(--warning-color); margin-bottom: 10px; font-size: 1rem;" class="flex-icon"><i data-lucide="bot"></i> <strong>El Asistente de Sintaxis dice:</strong></div>
         <ul style="margin-left: 20px; font-size: 0.9rem;">${listaErrores}</ul>
         <div style="margin-top: 12px; font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 8px;">
           💡 <strong>Nota pedagógica:</strong> Los errores de escritura no te quitan corazones ❤️. ¡Corrige los símbolos y vuelve a intentar!
         </div>`;
       btn.innerHTML = `<i data-lucide="play"></i> Verificar Código`; btn.disabled = false;
       if (window.lucide) lucide.createIcons();
       return; 
    }

    const cleanCode = codigoLimpio.replace(/\s+/g, '');
    const reto = weeks[currentRetoId].retos[nivel];
    let success = true;

    if (reto.match) { reto.match.forEach(str => { if (!cleanCode.includes(str)) success = false; }); }
    if (reto.minCount) {
      for (const [key, val] of Object.entries(reto.minCount)) {
        const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*'), 'g');
        if ((cleanCode.match(regex) || []).length < val) success = false;
      }
    }
    
    if (success) {
      fb.className = "feedback success"; fb.style.borderColor = ""; fb.style.backgroundColor = ""; 
      fb.innerHTML = `<div class="flex-icon"><i data-lucide="check-circle-2"></i> ${mensajesExito[Math.floor(Math.random()*mensajesExito.length)]}</div>`;
      confetti(); stopTimer(nivel);
      
      userData.savedCodes[`code_${currentRetoId}_${nivel}`] = originalCode;
      
      const isAlreadyDone = userData.progress[`reto_${currentRetoId}_${nivel}`] === true;
      if (!isAlreadyDone) {
        let premio = nivel === 'basico' ? 10 : (nivel === 'alto' ? 20 : 30);
        window.ganarVolts(premio);
      } else playCoinSound(); 

      userData.progress[`reto_${currentRetoId}_${nivel}`] = true;
      const currentRecord = userData.records[`record_${currentRetoId}_${nivel}`];
      if (!currentRecord || timers[nivel] < parseInt(currentRecord)) { userData.records[`record_${currentRetoId}_${nivel}`] = timers[nivel]; }
      
      saveToFirebase(); updateProgress(); setTimeout(() => { window.loadWeek(); }, 3500); 

    } else {
      fallos[nivel]++; vidas[nivel]--; playErrorSound(); 
      let corazones = ''; for(let i=0; i<3; i++) corazones += (i < vidas[nivel]) ? '❤️' : '🖤';
      document.getElementById(`vidas-${nivel}`).innerHTML = corazones;
      
      fb.className = "feedback error"; fb.style.borderColor = ""; fb.style.backgroundColor = ""; 
      
      if (vidas[nivel] <= 0) {
        fb.innerHTML = `<div class="flex-icon" style="margin-bottom:8px;"><i data-lucide="skull"></i> Lógica incorrecta. Sin energía.</div>`;
        document.getElementById(`input-${nivel}`).disabled = true; stopTimer(nivel);
        document.getElementById(`btn-container-${nivel}`).innerHTML = `<button class="btn-comprar-vida flex-icon" onclick="window.comprarEnergia('${nivel}')"><i data-lucide="battery-charging"></i> Recuperar 3 ❤️ (10 🪙)</button>`;
      } else {
        fb.innerHTML = `<div class="flex-icon"><i data-lucide="x-circle"></i> ${mensajesFallo[Math.floor(Math.random()*mensajesFallo.length)]}</div>`;
        if (pistasDesbloqueadas[nivel] === 0) pistasDesbloqueadas[nivel] = 1;
        renderPistas(nivel, reto);
      }
    }
    if (vidas[nivel] > 0) { btn.innerHTML = `<i data-lucide="play"></i> Verificar Código`; btn.disabled = false; }
    if (window.lucide) lucide.createIcons();
  }, 800);
}

// ==============================================================
// 11. RENDERIZADO DE LAS SEMANAS Y EL EDITOR
// ==============================================================
window.loadWeek = function() {
  currentRetoId = document.getElementById('week-select').value;
  const data = weeks[currentRetoId]; if (!data) return;

  document.getElementById('w-competencia').innerHTML = `<strong style="color:var(--wokwi-blue)">Competencia: ${competenciasMapa[currentRetoId]}</strong><br><span style="color:var(--text-light); font-size:0.95rem; display:block; margin-top:5px;">${data.introduccion}</span>`;
  
  const container = document.getElementById('teoria-container');
  container.innerHTML = ''; 
  ['basico', 'alto', 'superior'].forEach(nivel => {
    if(!data.teoria[nivel]) return;
    const t = data.teoria[nivel];
    const claveReclamada = `teoria_leida_${currentRetoId}_${nivel}`;
    const yaReclamado = userData.teoria[claveReclamada] === true;

    const tarjeta = document.createElement('div');
    tarjeta.className = `teoria-card border-${nivel}`;
    tarjeta.innerHTML = `
      <div class="teoria-header">
        <h4><i data-lucide="book-open"></i> ${t.titulo}</h4>
        <span class="recompensa-badge">🪙 +${t.monedas}</span>
      </div>
      <p class="teoria-texto">${t.contenido}</p>
      <div class="teoria-ejemplo">${t.ejemplo}</div>
      <button id="btn-teoria-${nivel}" class="btn-reclamar ${yaReclamado ? 'reclamado' : ''}" 
        onclick="window.reclamarMonedas('${currentRetoId}', '${nivel}', ${t.monedas})">
        ${yaReclamado ? '✔️ Recompensa Reclamada' : 'Marcar como leído y ganar 🪙'}
      </button>
    `;
    container.appendChild(tarjeta);
  });

  document.getElementById('w-challenge').innerHTML = data.challenge; 
  document.getElementById('w-code').textContent = data.code;
  document.getElementById('w-components').innerHTML = data.components.map(c => `<span class="tag">${c}</span>`).join('');
  document.getElementById('w-wiring').innerHTML = data.wiring.map(w => `<li>${w}</li>`).join('');

  const expContainer = document.getElementById('w-explicacion'); expContainer.innerHTML = ''; 
  if (data.explicacion) data.explicacion.forEach(p => expContainer.innerHTML += `<div class="step-card"><div class="step-code">${p.codigo.replace(/\n/g, '<br>')}</div><div class="step-text">${p.texto}</div></div>`);

  ['basico', 'alto', 'superior'].forEach(nivel => {
    stopTimer(nivel); timers[nivel] = 0; fallos[nivel] = 0; vidas[nivel] = 3; pistasDesbloqueadas[nivel] = 0;
    document.getElementById(`timer-${nivel}`).textContent = `⏱ 00:00`; document.getElementById(`vidas-${nivel}`).innerHTML = '❤️❤️❤️';
    const input = document.getElementById(`input-${nivel}`); 
    if(input) { input.disabled = false; input.classList.remove('syntax-ok','syntax-error'); }
    const btnCont = document.getElementById(`btn-container-${nivel}`);
    if(btnCont) btnCont.innerHTML = `<button id="btn-${nivel}" class="btn-verify flex-icon" onclick="window.verifyCode('${nivel}')"><i data-lucide="play"></i> Verificar Código</button>`;
    document.getElementById(`feedback-${nivel}`).style.display = 'none';
    document.getElementById(`pista-${nivel}`).classList.remove('visible');
    
    if(data.retos[nivel]) {
      document.getElementById(`r-container-${nivel}`).style.display = 'block'; 
      document.getElementById(`r-desc-${nivel}`).innerHTML = data.retos[nivel].desc;
      
      const isDone = userData.progress[`reto_${currentRetoId}_${nivel}`] === true;
      const record = userData.records[`record_${currentRetoId}_${nivel}`];
      
      const doneBadge = document.getElementById(`done-${nivel}`);
      const evalBox = document.getElementById(`eval-${nivel}`);

      const codeFinal = userData.savedCodes[`code_${currentRetoId}_${nivel}`];
      const borrador = userData.drafts[`draft_${currentRetoId}_${nivel}`];
      
      if (input) {
         if (isDone && codeFinal) input.value = codeFinal;
         else if (borrador) input.value = borrador;
         else input.value = "";
      }

      if (isDone) {
        doneBadge.style.display = 'flex'; evalBox.style.display = 'block'; 
        if(btnCont) btnCont.style.display = 'none';
        if(record) { document.getElementById(`record-done-${nivel}`).style.display = 'inline-block'; document.getElementById(`record-done-${nivel}`).textContent = `⏱ Récord: ${formatTime(parseInt(record))}`; }
      } else {
        doneBadge.style.display = 'none'; evalBox.style.display = 'block'; 
        if(btnCont) btnCont.style.display = 'block';
        if(record) { document.getElementById(`record-${nivel}`).style.display = 'inline-block'; document.getElementById(`record-${nivel}`).textContent = `🏆 Mejor: ${formatTime(parseInt(record))}`; } 
        else document.getElementById(`record-${nivel}`).style.display = 'none';
      }
      window.validarSintaxis(nivel);
    } else document.getElementById(`r-container-${nivel}`).style.display = 'none';
  });
  if (window.lucide) lucide.createIcons();
};

window.resetProgress = function() {
  if(confirm('¿Seguro que deseas reiniciar tu código? Se borrarán tus borradores no verificados de esta semana.')) {
    ['basico', 'alto', 'superior'].forEach(nivel => {
      delete userData.drafts[`draft_${currentRetoId}_${nivel}`];
      const isDone = userData.progress[`reto_${currentRetoId}_${nivel}`] === true;
      const input = document.getElementById(`input-${nivel}`);
      if (input && !isDone) input.value = '';
    });
    saveToFirebase(); window.loadWeek(); 
  }
}

// ==============================================================
// 12. FUNCIONES EXTRA (Portafolio PDF y Diploma)
// ==============================================================
function updateProgress() {
  if (!currentUser) return;
  const totalRetos = Object.keys(weeks).length * 3; let completados = 0;
  const container = document.getElementById('progreso-semanas'); container.innerHTML = '';
  Object.keys(weeks).forEach(sem => {
    let semCompletados = 0;
    ['basico', 'alto', 'superior'].forEach(n => { if(userData.progress[`reto_${sem}_${n}`] === true) { completados++; semCompletados++; } });
    const dot = document.createElement('div'); dot.className = 'semana-dot';
    if(semCompletados > 0 && semCompletados < 3) dot.classList.add('parcial'); else if(semCompletados === 3) dot.classList.add('completa');
    if(sem === currentRetoId) dot.classList.add('activa'); container.appendChild(dot);
  });
  document.getElementById('progreso-fill').style.width = (completados / totalRetos) * 100 + '%';
  document.getElementById('progreso-texto').textContent = `${completados} / ${totalRetos} retos`;
}

window.imprimirPortafolio = function() {
  if(!currentUser) return alert('Debes iniciar sesión para imprimir tu portafolio.');
  let htmlContenido = `<div class="print-header"><h1>Portafolio de Códigos - Arduino</h1><h2>Instituto Técnico Superior</h2><h2><strong>Estudiante:</strong> ${userData.nombres} - <strong>Grado:</strong> ${userData.grado}</h2></div>`;
  let codigosEncontrados = 0;

  Object.keys(weeks).forEach(sem => {
    let contenidoSemana = '';
    ['basico', 'alto', 'superior'].forEach(nivel => {
      const isDone = userData.progress[`reto_${sem}_${nivel}`] === true;
      let userCode = (userData.savedCodes && userData.savedCodes[`code_${sem}_${nivel}`]) || (userData.drafts && userData.drafts[`draft_${sem}_${nivel}`]);
      
      if (isDone || (userCode && userCode.trim().length > 5)) { 
        if (!userCode) userCode = "// Reto superado exitosamente";
        codigosEncontrados++;
        contenidoSemana += `<div class="print-code-box"><h4>Nivel ${nivel.toUpperCase()} - Módulo ${sem} ${isDone ? '✅' : '✍️(Borrador)'}</h4><pre><code>${userCode.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre></div>`;
      }
    });
    if (contenidoSemana !== '') htmlContenido += `<div class="print-week"><h3>Semana ${sem}: ${weeks[sem].title}</h3>${contenidoSemana}</div>`;
  });

  if (codigosEncontrados === 0) return alert('Aún no tienes códigos escritos en tu cuenta de la nube.');
  const printArea = document.getElementById('print-area');
  printArea.innerHTML = htmlContenido;
  setTimeout(() => { window.print(); }, 300);
};

window.descargarDiploma = function() {
  if(!currentUser) return;
  const totalRetos = Object.keys(weeks).length * 3; let completados = 0; let semanasSuperadas = new Set(); 
  Object.keys(weeks).forEach(sem => { ['basico', 'alto', 'superior'].forEach(n => { if(userData.progress[`reto_${sem}_${n}`] === true) { completados++; semanasSuperadas.add(sem); } }); });
  if(completados === 0) return alert('Debes completar al menos 1 reto.');

  document.getElementById('dip-nombre').textContent = userData.nombres; 
  document.getElementById('dip-grado').textContent = userData.grado;
  document.getElementById('dip-progreso').textContent = `${Math.round((completados / totalRetos) * 100)}%`;
  
  let notaFinal = ((completados / totalRetos) * 5).toFixed(1); 
  document.getElementById('dip-nota').textContent = `${notaFinal == "0.0" ? "1.0" : notaFinal} / 5.0`;

  let notaNumerica = parseFloat(notaFinal);
  const estadoBadge = document.getElementById('dip-estado');
  if(notaNumerica >= 3.0) { estadoBadge.textContent = "ESTADO: GRADUADO"; estadoBadge.style.background = "#238636"; } 
  else { estadoBadge.textContent = "ESTADO: REPROBADO"; estadoBadge.style.background = "#d73a49"; }

  const ulComps = document.getElementById('dip-competencias'); ulComps.innerHTML = '';
  semanasSuperadas.forEach(sem => { if(competenciasMapa[sem]) ulComps.innerHTML += `<li>✅ ${competenciasMapa[sem]}</li>`; });
  document.getElementById('dip-fecha').textContent = new Date().toLocaleDateString();

  const btn = document.getElementById('btn-diploma'); const originalHTML = btn.innerHTML;
  btn.innerHTML = `<i data-lucide="loader-2" class="lucide-spin"></i> Generando...`; lucide.createIcons();

  html2canvas(document.getElementById('diploma-wrapper'), { scale: 2 }).then(canvas => {
    const link = document.createElement('a'); link.download = `Diploma_${userData.nombres}.png`; link.href = canvas.toDataURL('image/png'); link.click();
    btn.innerHTML = originalHTML; lucide.createIcons(); confetti(); playCoinSound();
  });
}

window.onload = () => {
  document.getElementById('screen-login').classList.add('active'); 
  document.getElementById('screen-app').classList.remove('active'); 
  if (window.lucide) lucide.createIcons();
};