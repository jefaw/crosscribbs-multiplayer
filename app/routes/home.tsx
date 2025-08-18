export function meta() {
  return [
    { title: "CrossCribbs Multiplayer" },
    { name: "description", content: "Multiplayer card game" },
  ];
}

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">CrossCribbs Multiplayer</h1>
      <p className="mt-4 text-gray-600">Welcome to the game!</p>
    </div>
  );
}
