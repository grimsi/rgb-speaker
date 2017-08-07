#define RL 3
#define GL 5
#define BL 6
#define RR 9
#define GR 10
#define BR 11
#define IL A0
#define IR A1

void setup() {
  pinMode(RL, OUTPUT);
  pinMode(GL, OUTPUT);
  pinMode(BL, OUTPUT);
  pinMode(RR, OUTPUT);
  pinMode(GR, OUTPUT);
  pinMode(BR, OUTPUT);
  digitalWrite(RL, HIGH);
  digitalWrite(GL, HIGH);
  digitalWrite(BL, HIGH);  
  digitalWrite(RR, HIGH);
  digitalWrite(GR, HIGH);
  digitalWrite(BR, HIGH);
  Serial.begin(9600);
  setRGB(255, 0, 0, 2);
}
 
void loop() {
  checkAPI();
}

boolean checkAPI(){
  char mode = Serial.read();
  int r, g, b, speed, intensity;
  switch(mode){
    case 'c': r = Serial.parseInt();
              g = Serial.parseInt();
              b = Serial.parseInt();
              setRGB(r, g, b, 2); 
              flushSerial();
              return true;
              break;
    case 'l': r = Serial.parseInt();
              g = Serial.parseInt();
              b = Serial.parseInt();
              setRGB(r, g, b, 0); 
              flushSerial();
              return true;
              break;
    case 'r': r = Serial.parseInt();
              g = Serial.parseInt();
              b = Serial.parseInt();
              setRGB(r, g, b, 1); 
              flushSerial();
              return true;
              break;
    case 'f': speed = Serial.parseInt();
              intensity = Serial.parseInt();
              fadeRGB(speed, intensity);
              flushSerial();
              return true;
              break;
    case 'b': r = Serial.parseInt();
              g = Serial.parseInt();
              b = Serial.parseInt();
              speed = Serial.parseInt();
              breathSolid(r, g, b, speed);
              flushSerial();
              return true;
              break;
    case 'd': speed = Serial.parseInt();
              intensity = Serial.parseInt();
              breathRGB(speed, intensity);
              flushSerial();
              return true;
              break;
    default:  flushSerial();
              return false;
  }
}

void flushSerial(){
   while(Serial.available() > 0) {
        char t = Serial.read();
   }
}


void setRGB(int r, int g, int b, int side){
  switch(side){
    case 0: analogWrite(RL, 255-r);
            analogWrite(GL, 255-g);
            analogWrite(BL, 255-b);
            break;
    case 1: analogWrite(RR, 255-r);
            analogWrite(GR, 255-g);
            analogWrite(BR, 255-b);
            break;
    case 2: setRGB(r, g, b, 0);
            setRGB(r, g, b, 1);
            break;
    default: setRGB(r, g, b, 2);
             break;
  }
}

void fadeRGB(int speed, int intensity){
  int delayTime = 40/speed;
  while(true){
    int redVal = 255;
    int blueVal = 0;
    int greenVal = 0;
    
    for( int i = 0 ; i < 255; i++){
      greenVal += 1;
      redVal -= 1;
      setRGB(redVal, blueVal, greenVal, 0);
      setRGB(redVal, blueVal, greenVal, 1);
      if(checkAPI() == true){ return; }
      delay( delayTime );
    }
 
    redVal = 0;
    blueVal = 0;
    greenVal = 255;
    for( int i = 0 ; i < 255; i++ ){
      blueVal += 1;
      greenVal -= 1;
      setRGB(redVal, blueVal, greenVal, 0);
      setRGB(redVal, blueVal, greenVal, 1);
      if(checkAPI() == true){ return; }
      delay( delayTime );
    }
   
    redVal = 0;
    blueVal = 255;
    greenVal = 0;
    for( int i = 0 ; i < 255; i++ ){
      redVal += 1;
      blueVal -= 1;
      setRGB(redVal, blueVal, greenVal, 0);
      setRGB(redVal, blueVal, greenVal, 1);
      if(checkAPI() == true){ return; }
      delay( delayTime );
    }
  }
}

void breathSolid(int r, int g, int b, int speed){
  //TODO: implement
}

void breathRGB(int speed, int intensity){
  //TODO: implement
}

