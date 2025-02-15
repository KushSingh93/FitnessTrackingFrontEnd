const Button = ({ text, onClick, type = "button" }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all"
      >
        {text}
      </button>
    );
  };
  
  export default Button;