// src/components/Loader.jsx
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="loader-container">
      <motion.div
        className="loader"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loader;