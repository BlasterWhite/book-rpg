import './Inventory.scss';
import { BaseButton } from '@/composants/Base/BaseButton/BaseButton.jsx';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import PropTypes from 'prop-types';

export function Inventory({ characterId }) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [stats, setStats] = useState([
    { id: 1, label: 'Strength', value: 10, icon: '/icons/strength.svg', key: 'force' },
    { id: 2, label: 'Hardiness', value: 10, icon: '/icons/hardiness.svg', key: 'resistance' },
    { id: 3, label: 'Dexterity', value: 10, icon: '/icons/dexterity.svg', key: 'dexterite' },
    { id: 4, label: 'Psyche', value: 10, icon: '/icons/psyche.svg', key: 'psychisme' },
    { id: 5, label: 'Endurance', value: 10, icon: '/icons/endurance.svg', key: 'endurance' }
  ]);
  const [detailedItem, setDetailedItem] = useState({});
  const [characterName, setCharacterName] = useState();
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [hasAnInventory, setHasAnInventory] = useState(false);

  useEffect(() => {
    if (!user || !characterId) return;

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: user.token }
    };

    fetch(`${API_URL}/personnages/${characterId}`, requestOptions).then((response) =>
      response.json().then((data) => {
        setItems(data?.armes || []);
        let statsResult = [];
        for (let stat of stats) {
          statsResult.push({ ...stat, value: data[stat.key] });
        }
        setStats(statsResult);
        setHasAnInventory(data?.armes?.length > 0 || stats.length > 0);
        setCharacterName(data.nom || 'Character');
        setDetailedItem(items[0] || {});
      })
    );
  }, [user, API_URL, characterId]);

  // Detailed item
  useEffect(() => {
    setDetailedItem(items?.[0] || {});
  }, [items]);

  function inventorySlot() {
    let itemsResult = [];
    for (let itemSlot = 0; itemSlot < 5; itemSlot++) {
      itemsResult.push(
        <td key={itemSlot} onClick={() => setDetailedItem(items?.[itemSlot] || { id: itemSlot })}>
          {items[itemSlot] ? (
            <div
              className={'item' + (detailedItem === items[itemSlot] ? ' selected' : '')}
              style={{ backgroundImage: `url(${items[itemSlot]?.image?.image})` }}
            />
          ) : (
            <div className={'item' + (detailedItem.id === itemSlot ? ' selected' : '')} />
          )}
        </td>
      );
    }
    return itemsResult;
  }

  function StatsTable() {
    return (
      <table className={'stats'}>
        <tbody>
          {stats.map((stat) => (
            <tr key={stat.id}>
              <td className={'icon'}>
                <div className={'icon'} style={{ backgroundImage: `url(${stat.icon})` }} />
              </td>
              <td className={'label'}>{stat.label}</td>
              <td className={'value'}>{stat.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <>
      {hasAnInventory ? (
        <div className={'inventory ' + (isInventoryOpen ? 'open' : '')}>
          <h3>{characterName}</h3>
          <StatsTable />
          <table className={'items'}>
            <tbody>
              <tr>{inventorySlot()}</tr>
            </tbody>
          </table>
          {detailedItem?.titre ? (
            <div className={'item-details'}>
              <p>
                <strong>Name: </strong>
                {detailedItem?.titre || 'unknown'}
              </p>
              <p>
                <strong>Damage: </strong>
                {detailedItem?.degats || 'unknown'}
              </p>
              <p>
                <strong>Durability: </strong>
                {detailedItem?.durabilite === -1
                  ? 'Unlimited'
                  : detailedItem?.durabilite || 'unknown'}
              </p>
              <p>
                <strong>Description: </strong>
                {detailedItem?.description || 'unknown'}
              </p>
            </div>
          ) : null}
          <div className={'clip'} onClick={() => setIsInventoryOpen(!isInventoryOpen)}>
            <div className={'icon'} style={{ backgroundImage: `url('/icons/triangle.svg')` }} />
          </div>
        </div>
      ) : null}
    </>
  );
}

Inventory.propTypes = {
  characterId: PropTypes.string
};
