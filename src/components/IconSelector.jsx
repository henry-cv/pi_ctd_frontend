import { useState } from 'react';
import * as FaIcons from "react-icons/fa";
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SchoolIcon from '@mui/icons-material/School';
import KayakingIcon from '@mui/icons-material/Kayaking';
import InsightsIcon from '@mui/icons-material/Insights';
import '../css/components/IconSelector.css';

// Array de iconos disponibles
const availableIcons = [
  { name: 'FaCampground', component: FaIcons.FaCampground, label: 'Camping' },
  { name: 'FaWifi', component: FaIcons.FaWifi, label: 'WiFi' },
  { name: 'FaParking', component: FaIcons.FaParking, label: 'Parking' },
  { name: 'FaPaw', component: FaIcons.FaPaw, label: 'Mascotas' },
  { name: 'FaRestroom', component: FaIcons.FaRestroom, label: 'Baño' },
  { name: 'FaBabyCarriage', component: FaIcons.FaBabyCarriage, label: 'Bebés' },
  { name: 'FaWheelchair', component: FaIcons.FaWheelchair, label: 'Accesible' },
  { name: 'FaMountain', component: FaIcons.FaMountain, label: 'Montaña' },
  { name: 'FaMusic', component: FaIcons.FaMusic, label: 'Música' },
  { name: 'FaUtensils', component: FaIcons.FaUtensils, label: 'Comida' },
  { name: 'FaWineGlassAlt', component: FaIcons.FaWineGlassAlt, label: 'Vino' },
  { name: 'FaLanguage', component: FaIcons.FaLanguage, label: 'Idioma' },
  { name: 'FaBus', component: FaIcons.FaBus, label: 'Transporte' },
  // Nuevos iconos de FontAwesome
  { name: 'FaCamera', component: FaIcons.FaCamera, label: 'Cámara' },
  { name: 'FaBinoculars', component: FaIcons.FaBinoculars, label: 'Binoculares' },
  { name: 'FaDumbbell', component: FaIcons.FaDumbbell, label: 'Pesas' },
  { name: 'FaTelescope', component: FaIcons.FaTelescope, label: 'Telescopio' },
  { name: 'FaSpa', component: FaIcons.FaSpa, label: 'Spa' },
  { name: 'FaHiking', component: FaIcons.FaHiking, label: 'Senderismo' },
  { name: 'FaCow', component: FaIcons.FaCow, label: 'Vaca' },
  { name: 'FaTractor', component: FaIcons.FaTractor, label: 'Tractor' },
  { name: 'FaBriefcaseMedical', component: FaIcons.FaBriefcaseMedical, label: 'Médico' },
  { name: 'FaHorse', component: FaIcons.FaHorse, label: 'Caballo' },
  { name: 'FaFilm', component: FaIcons.FaFilm, label: 'Cine' },
  { name: 'FaWalking', component: FaIcons.FaWalking, label: 'Apto para ciegos' },
  // Iconos de Material UI
  { name: 'FlashlightOn', component: FlashlightOnIcon, label: 'Linterna' },
  { name: 'SelfImprovement', component: SelfImprovementIcon, label: 'Yoga' },
  { name: 'School', component: SchoolIcon, label: 'Educación' },
  { name: 'Kayaking', component: KayakingIcon, label: 'Kayak' },
  { name: 'Insights', component: InsightsIcon, label: 'Constelaciones' }
];

const IconSelector = ({ onSelectIcon, selectedIcon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar los iconos basados en el término de búsqueda
  const filteredIcons = searchTerm 
    ? availableIcons.filter(icon => 
        icon.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : availableIcons;

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectIcon = (iconName) => {
    onSelectIcon(iconName);
    setIsOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const selectedIconObj = availableIcons.find(icon => icon.name === selectedIcon);
  const IconComponent = selectedIconObj?.component || FaIcons.FaHeart;

  return (
    <div className="icon-selector-container">
      <div 
        className="selected-icon-display"
        onClick={handleToggleDropdown}
      >
        {selectedIcon ? (
          <>
            <IconComponent className="selected-icon" />
            <span className="selected-icon-name">{selectedIcon}</span>
          </>
        ) : (
          <span className="placeholder">Selecciona un icono</span>
        )}
      </div>

      {isOpen && (
        <div className="icon-dropdown">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Buscar icono..." 
              value={searchTerm}
              onChange={handleSearchChange}
              className="icon-search"
            />
          </div>
          <div className="icons-grid">
            {filteredIcons.map((icon) => {
              const IconComp = icon.component;
              return (
                <div 
                  key={icon.name} 
                  className={`icon-item ${selectedIcon === icon.name ? 'selected' : ''}`}
                  onClick={() => handleSelectIcon(icon.name)}
                  title={icon.label}
                >
                  <IconComp className="icon" />
                  <span className="icon-label">{icon.label}</span>
                </div>
              );
            })}
            {filteredIcons.length === 0 && (
              <div className="no-results">No se encontraron iconos</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconSelector;
