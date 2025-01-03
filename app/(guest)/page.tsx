import AmimateGif from "@/app/components/AmimateGif";
import GIF from "@/public/Gif.gif"

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-7.55rem)] flex justify-center items-center">
        <AmimateGif
        src={GIF}
        alt={"animated git"}
        />
    </div>
  );
}

