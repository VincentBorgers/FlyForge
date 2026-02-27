import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { Circle, Layer, Line, Rect, Stage, Text } from 'react-konva';
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  Copy,
  Download,
  Grid3X3,
  ImagePlus,
  Info,
  Layers,
  Minus,
  Plus,
  Redo2,
  Save,
  Sparkles,
  Trash2,
  Type,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { KonvaImageLayer } from './components/KonvaImage';
import type { FlyerDocument, FlyerLayer } from './types';

const presets: Array<{ name: string; width: number; height: number }> = [
  { name: 'A4 Portret', width: 794, height: 1123 },
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'A5 Flyer', width: 559, height: 794 },
  { name: 'Poster', width: 1000, height: 1414 },
];

const initialDoc: FlyerDocument = {
  width: presets[0].width,
  height: presets[0].height,
  background: '#ffffff',
  layers: [],
};

const LICENSE_TEXT = `MIT License\n\nCopyright (c) 2026 Vincent Borgers\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.`;

export function App() {
  const [doc, setDoc] = useState<FlyerDocument>(initialDoc);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<FlyerDocument[]>([]);
  const [future, setFuture] = useState<FlyerDocument[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(0.8);
  const [showInfo, setShowInfo] = useState(false);
  const stageRef = useRef<any>(null);

  const selectedLayer = useMemo(() => doc.layers.find((layer) => layer.id === selectedId) ?? null, [doc.layers, selectedId]);

  const commit = (next: FlyerDocument) => {
    setHistory((prev) => [...prev, doc]);
    setFuture([]);
    setDoc(next);
  };

  const updateLayer = (id: string, patch: Partial<FlyerLayer>) => {
    commit({
      ...doc,
      layers: doc.layers.map((layer) => (layer.id === id ? ({ ...layer, ...patch } as FlyerLayer) : layer)),
    });
  };

  const addText = () => {
    const id = uuid();
    commit({
      ...doc,
      layers: [
        ...doc.layers,
        { id, type: 'text', text: 'Nieuwe titel', x: 80, y: 80, rotation: 0, opacity: 1, fontSize: 56, fontFamily: 'Inter', fill: '#111827', width: 560 },
      ],
    });
    setSelectedId(id);
  };

  const addRect = () => {
    const id = uuid();
    commit({
      ...doc,
      layers: [...doc.layers, { id, type: 'rect', x: 60, y: 220, rotation: 0, opacity: 1, width: 680, height: 220, fill: '#14b8a6', cornerRadius: 18 }],
    });
    setSelectedId(id);
  };

  const addCircle = () => {
    const id = uuid();
    commit({ ...doc, layers: [...doc.layers, { id, type: 'circle', x: 680, y: 140, rotation: 0, opacity: 0.85, radius: 90, fill: '#f97316' }] });
    setSelectedId(id);
  };

  const applyTemplate = (template: 'sale' | 'event') => {
    if (template === 'sale') {
      commit({
        ...doc,
        background: '#f9fafb',
        layers: [
          { id: uuid(), type: 'rect', x: 40, y: 40, rotation: 0, opacity: 1, width: doc.width - 80, height: 190, fill: '#0f172a', cornerRadius: 24 },
          { id: uuid(), type: 'text', text: 'MEGA SALE', x: 75, y: 82, rotation: 0, opacity: 1, fontSize: 82, fontFamily: 'Inter', fill: '#f8fafc', width: doc.width - 120 },
          { id: uuid(), type: 'text', text: 'Tot 70% korting op alle items', x: 75, y: 170, rotation: 0, opacity: 1, fontSize: 30, fontFamily: 'Inter', fill: '#cbd5e1', width: doc.width - 120 },
          { id: uuid(), type: 'circle', x: doc.width - 130, y: doc.height - 140, rotation: 0, opacity: 1, radius: 100, fill: '#ef4444' },
          { id: uuid(), type: 'text', text: 'NU', x: doc.width - 170, y: doc.height - 172, rotation: -15, opacity: 1, fontSize: 62, fontFamily: 'Inter', fill: '#ffffff', width: 140 },
        ],
      });
      setSelectedId(null);
      return;
    }

    commit({
      ...doc,
      background: '#0f172a',
      layers: [
        { id: uuid(), type: 'text', text: 'LIVE EVENT', x: 75, y: 80, rotation: 0, opacity: 1, fontSize: 76, fontFamily: 'Inter', fill: '#f8fafc', width: doc.width - 120 },
        { id: uuid(), type: 'rect', x: 72, y: 182, rotation: 0, opacity: 1, width: 290, height: 52, fill: '#22d3ee', cornerRadius: 12 },
        { id: uuid(), type: 'text', text: '12 APRIL 20:00', x: 86, y: 194, rotation: 0, opacity: 1, fontSize: 27, fontFamily: 'Inter', fill: '#082f49', width: 260 },
        { id: uuid(), type: 'text', text: 'Centrumplein 9, Rotterdam', x: 75, y: 260, rotation: 0, opacity: 1, fontSize: 36, fontFamily: 'Inter', fill: '#cbd5e1', width: doc.width - 120 },
      ],
    });
    setSelectedId(null);
  };

  const onUploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const id = uuid();
      commit({
        ...doc,
        layers: [...doc.layers, { id, type: 'image', src: String(reader.result), x: 120, y: 120, rotation: 0, opacity: 1, width: 320, height: 200 }],
      });
      setSelectedId(id);
    };
    reader.readAsDataURL(file);
  };

  const deleteLayer = () => {
    if (!selectedId) return;
    commit({ ...doc, layers: doc.layers.filter((layer) => layer.id !== selectedId) });
    setSelectedId(null);
  };

  const duplicateLayer = () => {
    if (!selectedLayer) return;
    const cloned = { ...selectedLayer, id: uuid(), x: selectedLayer.x + 20, y: selectedLayer.y + 20 };
    commit({ ...doc, layers: [...doc.layers, cloned] });
    setSelectedId(cloned.id);
  };

  const centerLayer = (axis: 'x' | 'y') => {
    if (!selectedLayer) return;
    if (selectedLayer.type === 'circle') {
      updateLayer(selectedLayer.id, axis === 'x' ? { x: doc.width / 2 } : { y: doc.height / 2 });
      return;
    }
    const width = 'width' in selectedLayer ? selectedLayer.width : 0;
    const height = 'height' in selectedLayer ? selectedLayer.height : 0;
    updateLayer(
      selectedLayer.id,
      axis === 'x' ? { x: Math.round((doc.width - width) / 2) } : { y: Math.round((doc.height - height) / 2) },
    );
  };

  const exportImage = (type: 'png' | 'jpeg') => {
    const uri = stageRef.current?.toDataURL({ pixelRatio: 2, mimeType: type === 'png' ? 'image/png' : 'image/jpeg' });
    if (!uri) return;
    const a = document.createElement('a');
    a.download = `flyer.${type}`;
    a.href = uri;
    a.click();
  };

  const saveProject = () => {
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'flyforge-project.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const loadProject = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      const parsed = JSON.parse(text) as FlyerDocument;
      commit(parsed);
      setSelectedId(null);
    });
  };

  const undo = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [doc, ...f]);
    setDoc(previous);
  };

  const redo = () => {
    const next = future[0];
    if (!next) return;
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, doc]);
    setDoc(next);
  };

  const moveLayer = (direction: 'up' | 'down') => {
    if (!selectedId) return;
    const idx = doc.layers.findIndex((layer) => layer.id === selectedId);
    if (idx < 0) return;
    const to = direction === 'up' ? idx + 1 : idx - 1;
    if (to < 0 || to >= doc.layers.length) return;
    const layers = [...doc.layers];
    [layers[idx], layers[to]] = [layers[to], layers[idx]];
    commit({ ...doc, layers });
  };

  const gridLines = useMemo(() => {
    const spacing = 40;
    const lines: Array<{ points: number[] }> = [];
    for (let x = spacing; x < doc.width; x += spacing) lines.push({ points: [x, 0, x, doc.height] });
    for (let y = spacing; y < doc.height; y += spacing) lines.push({ points: [0, y, doc.width, y] });
    return lines;
  }, [doc.height, doc.width]);

  return (
    <>
      <div className="app-shell">
        <aside className="panel left">
          <h1>FlyForge Studio</h1>
          <p className="subtitle">Pro flyer design tool</p>

          <section>
            <h2>Template starters</h2>
            <div className="stack-buttons">
              <button onClick={() => applyTemplate('sale')}><Sparkles size={16} /> Sale template</button>
              <button onClick={() => applyTemplate('event')}><Sparkles size={16} /> Event template</button>
            </div>
          </section>

          <section>
            <h2>Nieuw element</h2>
            <div className="grid-buttons">
              <button onClick={addText}><Type size={16} /> Tekst</button>
              <button onClick={addRect}><Plus size={16} /> Vlak</button>
              <button onClick={addCircle}><Plus size={16} /> Cirkel</button>
              <label className="file-btn"><ImagePlus size={16} /> Foto<input type="file" accept="image/*" onChange={onUploadImage} /></label>
            </div>
          </section>

          <section>
            <h2>Document</h2>
            <select
              value={`${doc.width}x${doc.height}`}
              onChange={(e) => {
                const preset = presets.find((p) => `${p.width}x${p.height}` === e.target.value);
                if (!preset) return;
                commit({ ...doc, width: preset.width, height: preset.height });
              }}
            >
              {presets.map((preset) => (
                <option value={`${preset.width}x${preset.height}`} key={preset.name}>{preset.name}</option>
              ))}
            </select>
            <label>
              Achtergrond
              <input type="color" value={doc.background} onChange={(e) => commit({ ...doc, background: e.target.value })} />
            </label>
          </section>

          <section>
            <h2>Bestand</h2>
            <div className="stack-buttons">
              <button onClick={() => exportImage('png')}><Download size={16} /> Export PNG</button>
              <button onClick={() => exportImage('jpeg')}><Download size={16} /> Export JPG</button>
              <button onClick={saveProject}><Save size={16} /> Opslaan project</button>
              <label className="file-btn"><Layers size={16} /> Open project<input type="file" accept="application/json" onChange={loadProject} /></label>
            </div>
          </section>
        </aside>

        <main className="canvas-area">
          <div className="toolbar">
            <button disabled={!history.length} onClick={undo}><Undo2 size={15} /> Undo</button>
            <button disabled={!future.length} onClick={redo}><Redo2 size={15} /> Redo</button>
            <button disabled={!selectedId} onClick={() => moveLayer('up')}><Plus size={15} /> Naar voren</button>
            <button disabled={!selectedId} onClick={() => moveLayer('down')}><Minus size={15} /> Naar achteren</button>
            <button disabled={!selectedId} onClick={duplicateLayer}><Copy size={15} /> Dupliceer</button>
            <button onClick={() => setShowGrid((value) => !value)}><Grid3X3 size={15} /> Grid</button>
            <button onClick={() => setZoom((value) => Math.max(0.3, value - 0.1))}><ZoomOut size={15} /> </button>
            <button onClick={() => setZoom((value) => Math.min(1.6, value + 0.1))}><ZoomIn size={15} /> </button>
            <button onClick={() => setShowInfo(true)}><Info size={15} /> Info</button>
            <button disabled={!selectedId} onClick={deleteLayer}><Trash2 size={15} /> Verwijderen</button>
          </div>

          <div className="stage-wrap">
            <Stage
              width={doc.width * zoom}
              height={doc.height * zoom}
              scaleX={zoom}
              scaleY={zoom}
              ref={stageRef}
              onMouseDown={(e) => e.target === e.target.getStage() && setSelectedId(null)}
            >
              <Layer>
                <Rect x={0} y={0} width={doc.width} height={doc.height} fill={doc.background} />
                {showGrid && gridLines.map((line, index) => <Line key={index} points={line.points} stroke="#e2e8f020" strokeWidth={1} />)}

                {doc.layers.map((layer) => {
                  if (layer.type === 'text') {
                    return (
                      <Text
                        key={layer.id}
                        text={layer.text}
                        x={layer.x}
                        y={layer.y}
                        width={layer.width}
                        fontSize={layer.fontSize}
                        fontFamily={layer.fontFamily}
                        fill={layer.fill}
                        rotation={layer.rotation}
                        opacity={layer.opacity}
                        draggable
                        onClick={() => setSelectedId(layer.id)}
                        onTap={() => setSelectedId(layer.id)}
                        onDragEnd={(e) => updateLayer(layer.id, { x: Math.round(e.target.x()), y: Math.round(e.target.y()) })}
                      />
                    );
                  }
                  if (layer.type === 'rect') {
                    return (
                      <Rect
                        key={layer.id}
                        x={layer.x}
                        y={layer.y}
                        width={layer.width}
                        height={layer.height}
                        fill={layer.fill}
                        cornerRadius={layer.cornerRadius}
                        rotation={layer.rotation}
                        opacity={layer.opacity}
                        draggable
                        onClick={() => setSelectedId(layer.id)}
                        onTap={() => setSelectedId(layer.id)}
                        onDragEnd={(e) => updateLayer(layer.id, { x: Math.round(e.target.x()), y: Math.round(e.target.y()) })}
                      />
                    );
                  }
                  if (layer.type === 'circle') {
                    return (
                      <Circle
                        key={layer.id}
                        x={layer.x}
                        y={layer.y}
                        radius={layer.radius}
                        fill={layer.fill}
                        rotation={layer.rotation}
                        opacity={layer.opacity}
                        draggable
                        onClick={() => setSelectedId(layer.id)}
                        onTap={() => setSelectedId(layer.id)}
                        onDragEnd={(e) => updateLayer(layer.id, { x: Math.round(e.target.x()), y: Math.round(e.target.y()) })}
                      />
                    );
                  }
                  return (
                    <KonvaImageLayer
                      key={layer.id}
                      src={layer.src}
                      x={layer.x}
                      y={layer.y}
                      width={layer.width}
                      height={layer.height}
                      rotation={layer.rotation}
                      opacity={layer.opacity}
                      draggable
                      onSelect={() => setSelectedId(layer.id)}
                      onDragEnd={(x, y) => updateLayer(layer.id, { x: Math.round(x), y: Math.round(y) })}
                      onTransformEnd={(props) => updateLayer(layer.id, props)}
                    />
                  );
                })}
              </Layer>
            </Stage>
          </div>
        </main>

        <aside className="panel right">
          <h2>Eigenschappen</h2>
          <p className="tiny">Zoom: {Math.round(zoom * 100)}%</p>
          {!selectedLayer && <p>Klik op een element om te bewerken.</p>}
          {selectedLayer && (
            <div className="properties">
              <div className="grid-buttons">
                <button onClick={() => centerLayer('x')}><AlignCenterHorizontal size={15} /> Center X</button>
                <button onClick={() => centerLayer('y')}><AlignCenterVertical size={15} /> Center Y</button>
              </div>

              <label>X<input type="number" value={Math.round(selectedLayer.x)} onChange={(e) => updateLayer(selectedLayer.id, { x: Number(e.target.value) })} /></label>
              <label>Y<input type="number" value={Math.round(selectedLayer.y)} onChange={(e) => updateLayer(selectedLayer.id, { y: Number(e.target.value) })} /></label>
              <label>Rotatie<input type="number" value={Math.round(selectedLayer.rotation)} onChange={(e) => updateLayer(selectedLayer.id, { rotation: Number(e.target.value) })} /></label>
              <label>Opacity<input type="range" min={0} max={1} step={0.05} value={selectedLayer.opacity} onChange={(e) => updateLayer(selectedLayer.id, { opacity: Number(e.target.value) })} /></label>

              {'fill' in selectedLayer && <label>Kleur<input type="color" value={selectedLayer.fill} onChange={(e) => updateLayer(selectedLayer.id, { fill: e.target.value } as Partial<FlyerLayer>)} /></label>}
              {selectedLayer.type === 'text' && (
                <>
                  <label>Tekst<textarea value={selectedLayer.text} onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })} /></label>
                  <label>Font size<input type="number" min={8} value={selectedLayer.fontSize} onChange={(e) => updateLayer(selectedLayer.id, { fontSize: Number(e.target.value) })} /></label>
                  <label>Breedte<input type="number" min={40} value={selectedLayer.width} onChange={(e) => updateLayer(selectedLayer.id, { width: Number(e.target.value) })} /></label>
                </>
              )}
              {selectedLayer.type === 'rect' && (
                <>
                  <label>Breedte<input type="number" min={20} value={selectedLayer.width} onChange={(e) => updateLayer(selectedLayer.id, { width: Number(e.target.value) })} /></label>
                  <label>Hoogte<input type="number" min={20} value={selectedLayer.height} onChange={(e) => updateLayer(selectedLayer.id, { height: Number(e.target.value) })} /></label>
                  <label>Ronding<input type="number" min={0} value={selectedLayer.cornerRadius} onChange={(e) => updateLayer(selectedLayer.id, { cornerRadius: Number(e.target.value) })} /></label>
                </>
              )}
              {selectedLayer.type === 'circle' && (
                <label>Radius<input type="number" min={10} value={selectedLayer.radius} onChange={(e) => updateLayer(selectedLayer.id, { radius: Number(e.target.value) })} /></label>
              )}
              {selectedLayer.type === 'image' && (
                <>
                  <label>Breedte<input type="number" min={20} value={selectedLayer.width} onChange={(e) => updateLayer(selectedLayer.id, { width: Number(e.target.value) })} /></label>
                  <label>Hoogte<input type="number" min={20} value={selectedLayer.height} onChange={(e) => updateLayer(selectedLayer.id, { height: Number(e.target.value) })} /></label>
                </>
              )}
            </div>
          )}
        </aside>
      </div>

      {showInfo && (
        <div className="overlay" onClick={() => setShowInfo(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Software info</h3>
            <p>Licentie: MIT</p>
            <textarea value={LICENSE_TEXT} readOnly rows={16} />
            <button onClick={() => setShowInfo(false)}>Sluiten</button>
          </div>
        </div>
      )}
    </>
  );
}