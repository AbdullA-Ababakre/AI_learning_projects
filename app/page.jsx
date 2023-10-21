import Image from "next/image";
import Gallery from "./components/Gallery";
import { pressStart2P, sourceCodePro, instrumentSans } from "./styles/fonts";

export default function Home() {
  return (
    <div className="w-11/12 m-auto flex-col my-6">
      <div className="flex flex-row justify-start">
        <div className="flex flex-col items-start justify-center min-h-screen text-gray-800 py-4 px-4 sm:px-6 lg:px-8 w-6/12">
          <h2
            className={`w-full text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl text-left ${pressStart2P.className}`}
          >
            Your AI-JS Bootcamp Starts Here
          </h2>
          <p
            className={`w-full mt-6 max-w-2xl text-center text-lg leading-7 sm:text-2xl sm:leading-9 sm:text-left lg:text-3xl ${instrumentSans.className}`}
          >
            <span className="font-bold">
              Throughout this course, you'll be building stunning AI projects
              that are not only impressive but also have real-world
              applications.
            </span>
            Whether you're aiming to generate a passive income, create a
            personal assistant to streamline your work, or simply to enhance
            your portfolio, the skills and knowledge you acquire here will be
            instrumental in achieving your goals.
          </p>
        </div>
        {/* Gallery */}
        <Gallery />
      </div>
    </div>
  );
}
