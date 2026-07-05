import math
import os
import struct
import wave

out_path = os.path.join('assets', 'sounds', 'animal-tone.wav')
os.makedirs(os.path.dirname(out_path), exist_ok=True)
sample_rate = 22050
duration = 0.7
frequency = 660.0
amplitude = 14000
with wave.open(out_path, 'wb') as wav:
    wav.setnchannels(1)
    wav.setsampwidth(2)
    wav.setframerate(sample_rate)
    frames = []
    for i in range(int(duration * sample_rate)):
        value = int(amplitude * math.sin(2 * math.pi * frequency * i / sample_rate))
        frames.append(struct.pack('<h', value))
    wav.writeframes(b''.join(frames))
print(out_path)
