import { useEffect, useState } from "react";

export const Open = ({ setOpen }) => {

  const [box, setBox] = useState([]);
  const [load, setLoad] = useState(false);
  const [win, setWin] = useState({});
  const [no, setNo] = useState(false);

  useEffect(() => {
    const init = async () => {
      const wallet = await window.cryptomore.lib.getWallet(); 
      const list = await window.cryptomore.parse.getTokenList(wallet.publicKey);
      if(list.length === 0) setNo(true);
      for(let i = 0; i < list.length; i++) {
        list[i].info = await window.cryptomore.parse.getMeta(list[i].uri);
        if(list[i].info.SIB) setBox(prev => ([...prev, list[i]]));
      }
    }
    init();
  }, []);

  const open = async (one, i) => {
    setLoad(i);
    try{
      const res = await window.cryptomore.methods.openSolBox(one);
      if (!res.err) {
        const win = ((res.postBalances[0] - res.preBalances[0]) / 1000000000).toFixed(3);
        setWin({win, i});
        setTimeout(() => {
          setBox(prev => {
            prev = [...prev];
            prev.splice(i, 1);
            return prev;
          });
          setWin({});
        }, 3000);
      }
    }catch(e){}
    setLoad(false);
  }

  return(
    <div className="box-area">

      {no && <div className="no-box">
        You don't have any boxes yet
        <div className="login-button" style={{marginTop: '20px'}} onClick={setOpen.bind(null, false)} >
          BUY BOX
        </div>
      </div>}

      {box.map((k, i) => (
        <div key={i} className="box">
          {i === win.i && <div className="success">
            <div>Congrats!</div>
            <div>You won {win.win} SOL</div>
          </div>}
          <div className="box-name">{k.name}</div>
          <div className="box-wrap">
            <img className="box-image" src={load === i ? 'http://treasure.kotarosharks.io/open.gif' : k.info.image} alt="box" />
            {i !== win.i && <div className="box-open" onClick={open.bind(null, k, i)}>OPEN</div>}
          </div>
        </div>
      ))}
    </div>
  )
}