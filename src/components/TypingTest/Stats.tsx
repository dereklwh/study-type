interface StatsProps {
  wpm: number;
  accuracy: number;
  timeLeft: number;
  isActive: boolean;
}

export function Stats({ wpm, accuracy, timeLeft, isActive }: StatsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}`;
  };

  return (
    <div className="flex gap-8 text-3xl font-mono mb-8">
      <div className="text-accent">
        <span className="text-text-secondary text-lg block">time</span>
        {formatTime(timeLeft)}
      </div>
      {isActive && (
        <>
          <div className="text-text-primary">
            <span className="text-text-secondary text-lg block">wpm</span>
            {wpm}
          </div>
          <div className="text-text-primary">
            <span className="text-text-secondary text-lg block">acc</span>
            {accuracy}%
          </div>
        </>
      )}
    </div>
  );
}
