import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";

type ChildProps = {
  onSelect: (gameType: "local" | "online") => void;
  onBack: () => void;
};

export default function LocalOrOnline({ onSelect, onBack }: ChildProps) {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Select Game Type</h2>
      <button
        onClick={() => onSelect("local")}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
      >
        Local Multiplayer
      </button>
      <button
        onClick={() => navigate("/multiplayer-setup")}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
      >
        Online Multiplayer
      </button>
      <BackButton handler={onBack} />
    </div>
  );
}
