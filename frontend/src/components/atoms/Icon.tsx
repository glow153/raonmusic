import Icons from '../../assets/icon';
import { ButtonProp } from '../atoms';

interface Prop extends ButtonProp {
  name: string;
  size?: number;
  color?: string;
  fill?: string;
  stroke?: string;
  width?: number;
  height?: number;
}

const Icon = ({
  name,
  size = 30,
  color,
  fill,
  stroke,
  width: _width,
  height: _height,
}: Prop) => {
  const IconComp = Icons?.[name] ?? Icons['empty'];
  const width = _width ?? size;
  const height = _height ?? size;
  const sizeProps = {
    ...(width !== undefined ? {width} : {}),
    ...(height !== undefined ? {height} : {}),
  };

  return (
    <IconComp {...sizeProps}
      fill={fill ?? color ?? 'transparent'}
      stroke={stroke ?? color ?? 'transparent'}
    />
  );
};

export default Icon;