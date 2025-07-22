import RPi.GPIO as GPIO
import time
from network import make_request

BUTTON_PIN = 17
RED_PIN = 27
GREEN_PIN = 4
BLUE_PIN = 22

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(RED_PIN, GPIO.OUT)
GPIO.setup(BLUE_PIN, GPIO.OUT)
GPIO.setup(GREEN_PIN, GPIO.OUT)

print("Waiting for button press")

GPIO.output(BLUE_PIN, GPIO.LOW)

try:
  while True:
    if GPIO.input(BUTTON_PIN) == GPIO.LOW:
      print("Button pressed")
      response = make_request()

      if response == 200:
        GPIO.output(GREEN_PIN, GPIO.LOW)
      else:
        GPIO.output(RED_PIN, GPIO.LOW)


      print(f"Response sttatus code: {response}")
      time.sleep(0.1)
except KeyboardInterrupt:
  GPIO.cleanup()
