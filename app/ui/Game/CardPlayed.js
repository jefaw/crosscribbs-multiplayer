export default function (props) {
  const r = props.r;
  const c = props.c;
  const card = props.card;

  return (
    <>
      <img className="w-1/2 h-auto self-center" src={card.imgSrc} alt="" />
      <p className="self-center"> Cards left: {hand.length + 1}</p>
    </>
  );
}
