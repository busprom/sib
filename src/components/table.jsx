import { useState } from "react";
import { useMemo } from "react";

const head = ['Treasures', 'Bonus SOL', 'Probability', 'Found', 'Remains'];
const statHead = ['Date', 'Win', 'User', 'Transaction'];
const patHead = ['№', 'User', 'Total boxes', 'Total wins', 'Result'];

const getAddr = key => key.substr(0, 5) + '...' + key.substr(38);
const getTx = key => key.substr(0, 5) + '...' + key.substr(83);

export const Table = ({ lots, img, tx, price }) => {
  if (!img || !price) return null;
  const tot = useMemo(() => lots.reduce((acc, k) => (acc + parseInt(k.qty) - parseInt(k.wins)), 0), [lots]);

  const [stat, setStat] = useState(0);

  const data = useMemo(() => {
    let res = [], qty = 0, opened = 0, remains = 0;
    for (let i = 0; i < lots.length; i++) {
      opened += lots[i].wins;
      qty += lots[i].qty;
      remains += (lots[i].qty - lots[i].wins);
      if ((lots[i].qty - lots[i].wins) < 1) continue;
      lots[i].bonus = parseFloat(lots[i].bonus);
      res.push(lots[i]);
    }
    return { res: sortTbody('bonus', res), opened, remains, qty };
  }, [lots]);

  const us = useMemo(() => {
    const users = [];
    for(let i = 0; i < tx.length; i++) {
      let index = users.findIndex(k => k.user === tx[i].user);
      if(index === -1) users.push({user: tx[i].user, count: 1, win: tx[i].win});
      else users[index] = {...users[index], count: users[index].count + 1, win: users[index].win + tx[i].win};
    }
    return sortTbody('-win', users);
  }, [tx]);

  return (
    <>
      <div className="table-stat">
        <h3 style={{boxShadow: stat === 0 ? 'none' : 'inset 1px 1px 10px #000',background: stat === 0 ? 'none' : '#64408e', color: stat === 0 ? '#64408e' : '#fff'}} onClick={setStat.bind(null, 0)}>Game Statistics</h3>
        <h3 style={{boxShadow: stat === 1 ? 'none' : 'inset 1px 1px 10px #000',background: stat === 1 ? 'none' : '#64408e', color: stat === 1 ? '#64408e' : '#fff'}} onClick={setStat.bind(null, 1)}>Transaction statistics</h3>
        <h3 style={{boxShadow: stat === 2 ? 'none' : 'inset 1px 1px 10px #000',background: stat === 2 ? 'none' : '#64408e', color: stat === 2 ? '#64408e' : '#fff'}} onClick={setStat.bind(null, 2)}>Participants</h3>
      </div>
      
      <div className="table-wrap">
        {stat === 0 ? <table className="table">
          <thead>
            <tr>
              {head.map((k, i) => (
                <th key={i}>{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.res.map((k, i) => (
              <tr key={i}>
                <td className="quity">
                  <img style={{ width: '50px' }} src={img.img} alt="box" />
                  <span> - {parseInt(k.qty)}</span>
                </td>
                <td>
                  {k.bonus} SOL
                </td>
                <td>
                  {parseInt((k.qty - k.wins) * 100 / tot)}%
                </td>
                <td>
                  {k.wins}
                </td>
                <td>
                  {k.qty - k.wins}
                </td>
              </tr>
            ))}
            <tr>
              <td align="center"><b>{data.qty}</b></td>
              <td colSpan={2} />
              <td><b>{data.opened}</b></td>
              <td><b>{data.remains}</b></td>
            </tr>
          </tbody>
        </table>
        : stat === 1 ? <table className="table">
          <thead>
            <tr>
              {statHead.map((k, i) => (
                <th key={i}>{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tx.map((k, i) => (
              <tr key={i}>
                <td>{k.data}</td>
                <td>{k.win.toFixed(2)} SOL</td>
                <td><a href={'https://solscan.io/account/'+k.user} target="_blank" rel="noreferrer">
                  {getAddr(k.user)}
                </a></td>
                <td><a href={'https://solscan.io/tx/'+k.id} target="_blank" rel="noreferrer">
                  {getTx(k.id)}
                </a></td>
              </tr>
            ))}
          </tbody>
        </table>
        : <table className="table">
          <thead>
            <tr>
              {patHead.map((k, i) => (
                <th key={i}>{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {us.map((k, i) => (
              <tr key={i}>
                <td>{i+1}</td>
                <td><a href={'https://solscan.io/account/'+k.user} target="_blank" rel="noreferrer">
                  {getAddr(k.user)}
                </a></td>
                <td>{k.count} <i style={{fontSize: '12px'}}>({(parseFloat(price.price)*k.count).toFixed(2)} SOL)</i></td>
                <td>{k.win.toFixed(2)} SOL</td>
                <td>{(k.win-parseFloat(price.price)*k.count).toFixed(2)} SOL</td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    </>
  )
}

const sortTbody = (row, body) => {
  if (!Array.isArray(body) || !row) return body;
  function sortByAttribute(array, ...attrs) {
    if (!row || !body) return [];
    let predicates = attrs.map(pred => {
      let descending = pred.charAt(0) === '-' ? -1 : 1;
      pred = pred.replace(/^-/, '');
      return {
        getter: o => o[pred],
        descend: descending
      };
    });
    return array.map(item => {
      return {
        src: item,
        compareValues: predicates.map(predicate => predicate.getter(item))
      };
    })
      .sort((o1, o2) => {
        let i = -1, result = 0;
        while (++i < predicates.length) {
          if (o1.compareValues[i] < o2.compareValues[i]) result = -1;
          if (o1.compareValues[i] > o2.compareValues[i]) result = 1;
          result *= predicates[i].descend;
          if (result) break;
        }
        return result;
      })
      .map(item => item.src);
  }

  return sortByAttribute(body, row);

}