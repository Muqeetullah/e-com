import Image from "next/image";

interface Props {
  src?: string;
}

const SelectedImageThumb = ({src}: Props) => {
  if (!src) {
    console.log("Source", src);
    return;
  }

  return (
    <div className="w-20 h-20">
      <Image
        src={src}
        alt="product"
        fill
        className="object-fill rounded bg-blue-gray-200"
      />
    </div>
  );
};

export default SelectedImageThumb;
