import './BaseButton.scss';
import PropTypes from 'prop-types';

export function BaseButton({ text, onClick, disabled, outlined, icon, type }) {
  return (
    <button
      className={`base-button ${outlined ? 'outlined' : ''}`}
      onClick={onClick}
      disabled={disabled}
      type={type}>
      {icon && <img src={icon} alt={text} />}
      {text}
    </button>
  );
}

BaseButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  outlined: PropTypes.bool,
  icon: PropTypes.string,
  type: PropTypes.string
};
