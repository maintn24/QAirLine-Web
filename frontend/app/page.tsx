import style from "@/app/UI/mainpage.module.css";
import "@/app/UI/global.css";

export default function Home() {
  return (
    <main>
      <div className={style.main_image}>
        <img src="Image&Icon/image_mainpage.png" alt="Main image"></img>
      </div>
      <div className="offers">
        <h1 className="text-center font-bold">----------Offers----------</h1>
      </div>

      <div className="hotDes">
      <h1 className="text-center font-bold">----------Hot Destination----------</h1>
      </div>
    </main>
  );
}
