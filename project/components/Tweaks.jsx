/* global React */
function Tweaks({ state, setKey }) {
  const [editMode, setEditMode] = React.useState(false);
  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e.data && e.data.type;
      if (t === '__activate_edit_mode') setEditMode(true);
      if (t === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    // Announce availability AFTER listener is wired
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  if (!editMode) return null;

  return (
    <div className={'tweaks open'}>
      <div className="tweaks-h">
        <span className="t">Tweaks</span>
        <span className="close" onClick={() => setEditMode(false)}>×</span>
      </div>

      <div className="tweaks-row">
        <span className="lbl">Language</span>
        <div className="tweaks-seg">
          {['en', 'ja'].map(v => (
            <button key={v} className={state.lang === v ? 'on' : ''} onClick={() => setKey('lang', v)}>{v.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="tweaks-row">
        <span className="lbl">Theme</span>
        <div className="tweaks-seg">
          {['light', 'dark'].map(v => (
            <button key={v} className={state.theme === v ? 'on' : ''} onClick={() => setKey('theme', v)}>{v}</button>
          ))}
        </div>
      </div>

      <div className="tweaks-row">
        <span className="lbl">Editorial</span>
        <div className="tweaks-seg">
          {['quiet', 'normal', 'loud'].map(v => (
            <button key={v} className={state.intensity === v ? 'on' : ''} onClick={() => setKey('intensity', v)}>{v}</button>
          ))}
        </div>
      </div>

      <div className="tweaks-row">
        <span className="lbl">Cursor</span>
        <div className="tweaks-seg">
          {['on', 'off'].map(v => (
            <button key={v} className={state.cursor === v ? 'on' : ''} onClick={() => setKey('cursor', v)}>{v}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
window.Tweaks = Tweaks;
