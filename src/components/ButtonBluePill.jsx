import '../css/BluePill.css';

const BottonBluePill = ({ text = "Button" }) => {
  return (
    <button
      className='boton-blue'
    >
      {text}
    </button>
  )
}

export default BottonBluePill