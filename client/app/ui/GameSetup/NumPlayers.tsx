import BackButton from "./BackButton";

type ChildProps = {
  onSelect: (onSelect: 2 | 4) => void;
  onBack: () => void;
};

export default function NumPlayers({ onSelect, onBack }: ChildProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Select Game Mode</h2>
      <button
        onClick={() => onSelect(2)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
      >
        1v1
      </button>
      <button
        onClick={() => onSelect(4)}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
      >
        2v2
      </button>
      <BackButton handler={onBack} />
    </div>
  );
}
