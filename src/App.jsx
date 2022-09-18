import { useEffect, useState } from 'react';
import './App.css';
import { Buy } from './components/buy';
import { Open } from './components/open';
import { Table } from './components/table';

const arr = [
  { name: 'Submarine', href: 'http://submarine.kotarosharks.io/' },
  { name: 'Coinflip', href: 'https://coinflip.kotarosharks.io' },
  { name: 'Kotaro Sharks', href: 'https://magiceden.io/creators/kotaro_sharks' }
];

function App() {
  const [lots, setLots] = useState([]);
  const [open, setOpen] = useState(false);
  const [games, setGames] = useState([]);
  const [current, setCurrent] = useState(0);
  const [tx, setTx] = useState([]);

  const sol = <img className="solana-img" src='/img/solana.png' alt="box" />;

  const findLots = async id => {
    setTx([]);
    const game = await window.cryptomore.parse.getSIB({ id });
    if (game.lots) setLots(game.lots);
  }

  useEffect(() => {
    const init = async () => {
      let g = await fetch('/games.json');
      g = await g.json();
      if (!g.lots[0] || !g.point) return;
      window.cryptomore.lib.setPoint(g.point);
      setGames(g.lots);
      findLots(g.lots[0].id);
    }
    init();
  }, []);

  return (
    <div className="app">

      <div className="header">
        <div className="header-top">
          <img onClick={setOpen.bind(null, false)} style={{ cursor: 'pointer', width: '200px' }} src="/img/cmDemo.png" alt="logo" />

          <div className="main-buttons">
            <div style={{ marginRight: '20px', opacity: open === false ? 1 : .5 }} className="login-button" onClick={setOpen.bind(null, false)}>
              BUY BOX
            </div>
            <div style={{ opacity: open === true ? 1 : .5 }} className="login-button" onClick={setOpen.bind(null, true)}>
              OPEN BOX
            </div>
          </div>

        </div>

        {!open && <div className="menu">
          {games.map((k, i) => (
            <div key={i} className={'games-wrap' + (i === current ? ' game-active' : '')}
              onClick={() => {
                setCurrent(i);
                findLots(k.id);
              }}
            >

              <div className="games-info-wrap">
                Min - {k.min} {sol}
              </div>

              <div className="games-box">
                <img className="box-img" src={k.img} alt="box" />
                <div className="total-info" >
                  <div class="stage">
                    <div class="layer"></div>
                    <div class="layer"></div>
                    <div class="layer"></div>
                    <div class="layer"></div>
                    <div class="layer"></div>
                    <div class="layer"></div>
                    <div class="layer"></div>
                    <div class="layer"></div>
                    <div class="layer"></div>
                    <div class="layer"></div>
                  </div>
                  {k.price} SOL
                </div>
              </div>

              <div className="games-info-wrap">
                Max - {k.max} {sol}
              </div>

            </div>
          ))}
        </div>}

      </div>

      <div className="main">
        {open ? <Open setOpen={setOpen} lot={games[current]} /> : <Buy lot={games[current]} setTx={setTx} />}
      </div>

      <Table lots={lots} img={games[current]} tx={tx} />

      <div className="games">
        {arr.map((k, i) => (
          <a key={i} href={k.href} target="_blank" rel="noreferrer">
            <img src={'/img/game-' + i + '.png'} alt={'game-' + i} />
          </a>
        ))}
      </div>

      <div className="footer">
        <a href="https://cryptomore.me/" target="_blank" rel="noreferrer">
          <img src="/img/cmWhite.png" alt="cryptomore" />
        </a>
        <span>Create your own NFT Mystery Boxes on Solana</span>
      </div>

    </div>
  );
}

export default App;

