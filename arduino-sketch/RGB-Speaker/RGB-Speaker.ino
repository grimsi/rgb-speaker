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
              flushSerial();
              setRGB(r, g, b, 2);
              return true;
              break;
    case 'l': r = Serial.parseInt();
              g = Serial.parseInt();
              b = Serial.parseInt();
              flushSerial();
              setRGB(r, g, b, 0);
              flushSerial();
              return true;
              break;
    case 'r': r = Serial.parseInt();
              g = Serial.parseInt();
              b = Serial.parseInt();
              flushSerial();
              setRGB(r, g, b, 1);
              return true;
              break;
    case 'f': speed = Serial.parseInt();
              intensity = Serial.parseInt();
              flushSerial();
              fadeRGB(speed, intensity);
              return true;
              break;
    case 'b': r = Serial.parseInt();
              g = Serial.parseInt();
              b = Serial.parseInt();
              speed = Serial.parseInt();
              flushSerial();
              breathSolid(r, g, b, speed);
              return true;
              break;
    case 'd': speed = Serial.parseInt();
              intensity = Serial.parseInt();
              flushSerial();
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
    
    for(int i=0; i<255; i++){
      greenVal++;
      redVal--;
      setRGB(redVal, blueVal, greenVal, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
 
    redVal = 0;
    blueVal = 0;
    greenVal = 255;
    for(int i=0; i<255; i++){
      blueVal++;
      greenVal--;
      setRGB(redVal, blueVal, greenVal, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
   
    redVal = 0;
    blueVal = 255;
    greenVal = 0;
    for(int i=0; i<255; i++){
      redVal++;
      blueVal--;
      setRGB(redVal, blueVal, greenVal, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
  }
}

void breathSolid(int r, int g, int b, int speed){
  int delayTime = 40/speed;
  while(true){    
    for(int i=255; i>0; i--){
      setRGB(map(i, 0, 255, 0, r), map(i, 0, 255, 0, g), map(i, 0, 255, 0, b), 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
    delay(25*delayTime);
    for(int i=0; i<255; i++){
      setRGB(map(i, 0, 255, 0, r), map(i, 0, 255, 0, g), map(i, 0, 255, 0, b), 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
    delay(50*delayTime);
  }
}

void breathRGB(int speed, int intensity){
  int delayTime = 40/speed;
  while(true){
    for(int i=255; i!=0; i--){
      setRGB(i, 0, 0, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
    
    for(int i=0; i<255; i++){
      setRGB(i, i, 0, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
    for(int i=255; i!=0; i--){
      setRGB(i, i, 0, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
    
    for(int i=0; i<255; i++){
      setRGB(0, i, 0, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
    for(int i=255; i!=0; i--){
      setRGB(0, i, 0, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
    
    for(int i=0; i<255; i++){
      setRGB(0, i, i, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
    for(int i=255; i!=0; i--){
      setRGB(0, i, i, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
    
    for(int i=0; i<255; i++){
      setRGB(0, 0, i, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
    for(int i=255; i!=0; i--){
      setRGB(0, 0, i, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
    
    for(int i=0; i<255; i++){
      setRGB(i, 0, i, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
    for(int i=255; i!=0; i--){
      setRGB(i, 0, i, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }

    for(int i=0; i<255; i++){
      setRGB(i, 0, 0, 2);
      if(checkAPI() == true){ return; }
      delay(delayTime);
    }
  }
}

