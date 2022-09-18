import { useEffect, useState } from "react";
let one;

export const Buy = ({ lot = {}, setTx }) => {
  const [load, setLoad] = useState(true);
  const [suc, setSuc] = useState('');
  const [qty, setQty] = useState([]);
  
  useEffect(() => {
    if(!lot.id) return;
    setLoad(true);
    const init = async () => {
      const list = await window.cryptomore.parse.getMarketList([]);
      const keys = [];
      for(let i = 0; i < list.length; i++) {
        let info = await window.cryptomore.parse.getMeta(list[i].uri);
        if(info.SIB && info.SIB === lot.id) {
          if(!one) one = list[i];
          keys.push(list[i]);
        }
      }
      setQty(keys);
      setLoad(false);
      const tx = await window.cryptomore.parse.getAllTx(lot.id);
      setTx(tx);
    }
    init();
  }, [lot]);

  const buy = async () => {
    setLoad(true);
    try {
      const min = Math.ceil(0);
      const max = Math.floor(qty.length - 1);
      const rand = Math.floor(Math.random() * (max - min + 1)) + min;
      one.mint = qty[rand];
      const res = await window.cryptomore.methods.buyToken(qty[rand]);
      setQty(prev => {
        prev = [...prev];
        prev.splice(rand, 1);
        return prev;
      });
      if (!res.err) setSuc('Successful purchase');
      else setSuc('Someone has already bought this, try another one!');
    } catch (e) { }
    setLoad(false);
  }

  return (
    <div className="main-box">
      <div className="sollink">
        <a className="solscan" href={'https://solscan.io/account/' + lot.id} target="_blank" rel="noreferrer">
          View in SolScan
        </a>
      </div>
      <div className="one-box">
        {load && <div className="loader">
          <img src="/img/load.gif" alt="load" />
        </div>}
        {suc && <div className="success">
          <div>{suc}</div>
          <div className="buy-button" style={{width: '80%', marginTop: '25px'}} onClick={setSuc.bind(null, false)}>
            OK
          </div>
        </div>}
        <img style={{height: '300px'}} src={lot.img} alt="box" />
        <div style={{color: '#ffffff'}}>Quantity - {load ? '?' : qty.length}</div>
        <div className="buy-button" onClick={buy} style={{ width: 'auto' }}>
          {'BUY FOR ' + lot.price + 'SOL'}
        </div>
      </div>
    </div>
  )
}