import React, {
  type DetailedHTMLProps,
  type ImgHTMLAttributes,
  useState,
} from "react";

const ImageFallback: React.FC<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = (props) => {
  const [src, setSRC] = useState<string>(props.src || "/404.jpg");

  return <img {...props} src={src} onError={() => setSRC("/404.jpg")} />;
};

export default ImageFallback;
