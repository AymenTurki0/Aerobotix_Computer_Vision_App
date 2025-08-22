import pygame.mixer
import random
from constants import sword_sounds_path


# Function to play a random sword sound
def play_sword_sound():
    sword_sound_path = random.choice(sword_sounds_path)
    pygame.mixer.Sound(sword_sound_path).play()
