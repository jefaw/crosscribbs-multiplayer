import { useNavigate } from "react-router";

type ChildProps = {
  handler?: any;
};
export default function BackButton({ handler }: ChildProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (handler) {
      handler();
    } else {
      navigate(-1);
    }
  };
  return (
    <button
      onClick={handleClick}
      className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-base transition-colors duration-200"
    >
      Back
    </button>
  );
}
