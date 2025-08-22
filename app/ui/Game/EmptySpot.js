export default function EmptySpot(props) {
  const r = props.r;
  const c = props.c;
  return (
    <td
      key={`${r}-${c}`} // Adding a unique key to each table cell
      className="w-10 sm:w-28 h-20 sm:h-1/5 mx-10 mb-10 bg-stone-200 border-2 border-stone-700 hover:bg-blue-300 transition duration-300 cursor-pointer"
      onClick={() => handleCellClick(r, c)}
    ></td>
  );
}
