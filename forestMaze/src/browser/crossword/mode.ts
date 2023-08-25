let playing = false;

export function isPlaying(): boolean {
  return playing;
}

export function startPlaying(): void {
  playing = true;
}

export function stopPlaying(): void {
  playing = false;
}
