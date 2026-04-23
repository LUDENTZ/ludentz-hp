import { useState } from 'react';

export default function Tweaks({ state, setKey }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={'tweaks-toggle' + (open ? ' hidden' : '')}
        onClick={() => setOpen(true)}
      >
        Tweaks
      </button>
      <div className={'tweaks' + (open ? ' open' : '')}>
        <div className="tweaks-h">
          <span className="t">Tweaks</span>
          <span className="close" onClick={() => setOpen(false)}>×</span>
        </div>
        <div className="tweaks-row">
          <span className="lbl">Language</span>
          <div className="tweaks-seg">
            {['en', 'ja'].map(v => (
              <button key={v} className={state.lang === v ? 'on' : ''} onClick={() => setKey('lang', v)}>
                {v.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="tweaks-row">
          <span className="lbl">Theme</span>
          <div className="tweaks-seg">
            {['light', 'dark'].map(v => (
              <button key={v} className={state.theme === v ? 'on' : ''} onClick={() => setKey('theme', v)}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="tweaks-row">
          <span className="lbl">Editorial</span>
          <div className="tweaks-seg">
            {['quiet', 'normal', 'loud'].map(v => (
              <button key={v} className={state.intensity === v ? 'on' : ''} onClick={() => setKey('intensity', v)}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="tweaks-row">
          <span className="lbl">Cursor</span>
          <div className="tweaks-seg">
            {['on', 'off'].map(v => (
              <button key={v} className={state.cursor === v ? 'on' : ''} onClick={() => setKey('cursor', v)}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
