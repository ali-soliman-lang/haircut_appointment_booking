import "./index.css";

interface BarberBoxProps {
  children: React.ReactNode;
}

const BarberBox: React.FC<BarberBoxProps> = ({ children }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">{children}</div>
  );
};

export default BarberBox;
