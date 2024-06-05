import './Footer.scss';
import arrowOutIcon from '@/assets/icons/ArrowOutIcon.svg';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import upChevronIcon from '@/assets/icons/upChevronIcon.svg';
import { BaseButton } from '../Base/BaseButton/BaseButton';

export function Footer({ isFoldable, folded }) {
  const [isFolded, setIsFolded] = useState(!folded);

  useEffect(() => {
    if (isFolded) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, [isFolded]);

  return (
    <div className={'footer-background ' + (!isFolded ? 'closed' : 'open')}>
      {isFoldable && (
        <div
          className={'clip'}
          onClick={() => {
            setIsFolded(!isFolded);
          }}>
          <div className={'icon'} style={{ backgroundImage: `url(${upChevronIcon})` }} />
        </div>
      )}
      {isFolded && (
        <div className={'footer-body'}>
          <div className={'footer-item left'}>
            <h1>
              Cayden
              <br />
              Entertainment<span>&copy;</span>
            </h1>
          </div>
          <div className={'footer-item center'}>
            <ul>
              {/*TODO: Remplir le lien*/}
              <li>
                <NavLink to={''}>
                  Legal concept <img src={arrowOutIcon} alt="Arrow Out Icon" />
                </NavLink>
              </li>
              {/*TODO: Remplir le lien*/}
              <li>
                <NavLink to={''}>
                  Privacy <img src={arrowOutIcon} alt="Arrow Out Icon" />
                </NavLink>
              </li>
              {/*TODO: Remplir le lien*/}
              <li>
                <NavLink to={''}>
                  FAQs <img src={arrowOutIcon} alt="Arrow Out Icon" />
                </NavLink>
              </li>
              {/*TODO: Remplir le lien*/}
              <li>
                <NavLink to={''}>
                  Career <img src={arrowOutIcon} alt="Arrow Out Icon" />
                </NavLink>
              </li>
            </ul>
          </div>
          <div className={'footer-item right'}>
            <p>
              Subscribe to our newsletter and unlock a world of adventure, with exclusive updates,
              new releases, and special offers delivered straight to your inbox!
            </p>
            <div className={'footer-send-mail'}>
              <input type="email" placeholder={'john.doe@gmail.com'}></input>
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Footer.propTypes = {
  isFoldable: PropTypes.bool,
  folded: PropTypes.bool
};
