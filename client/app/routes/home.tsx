import { useNavigate } from "react-router-dom";

export default function MultiplayerSetup() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-transparent bg-clip-text">
          Cross Cribbs
        </h1>
      </div>
      <div className="bg-slate-700 p-8 rounded-lg shadow-xl w-[400px]">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Home</h2>
        <div className="space-y-4">
          <button
            onClick={() => navigate("/menu")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
}
