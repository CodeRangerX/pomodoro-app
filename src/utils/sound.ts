import * as ExpoAV from 'expo-av';

export async function playBeep() {
  try {
    const { sound } = await ExpoAV.Audio.Sound.createAsync(
      { uri: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
      { shouldPlay: true, volume: 0.8 },
    );
    setTimeout(() => {
      sound.unloadAsync();
    }, 2000);
  } catch {
    // fallback: do nothing
  }
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
