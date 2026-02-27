import { Image } from 'react-konva';
import useImage from 'use-image';

interface KonvaImageProps {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (props: { x: number; y: number; width: number; height: number; rotation: number }) => void;
  draggable: boolean;
}

export function KonvaImageLayer(props: KonvaImageProps) {
  const [image] = useImage(props.src, 'anonymous');

  return (
    <Image
      image={image}
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      rotation={props.rotation}
      opacity={props.opacity}
      draggable={props.draggable}
      onClick={props.onSelect}
      onTap={props.onSelect}
      onDragEnd={(e) => props.onDragEnd(e.target.x(), e.target.y())}
      onTransformEnd={(e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        props.onTransformEnd({
          x: node.x(),
          y: node.y(),
          width: Math.max(20, node.width() * scaleX),
          height: Math.max(20, node.height() * scaleY),
          rotation: node.rotation(),
        });
      }}
    />
  );
}
